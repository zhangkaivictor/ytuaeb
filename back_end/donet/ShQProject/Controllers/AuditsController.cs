using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using Dxc.Shq.WebApi.Core;
using Dxc.Shq.WebApi.Models;
using Dxc.Shq.WebApi.ViewModels;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace Dxc.Shq.WebApi.Controllers
{
    public class AuditsController : ApiController
    {
        private ShqContext db = new ShqContext();

        // GET: api/Audits
        public AuditViewModel GetAudits()
        {
            AuditViewModel avm = new AuditViewModel();

            DateTime last30Days = DateTime.Now - (new TimeSpan(30, 0, 0, 0));
            var all = db.Audits.Where(item => item.CreatedTime > last30Days);

            var logins = from user in all
                         where user.Operation == "login"
                         orderby user.CreatedTime descending
                         select user.OperationDetails + "," + user.CreatedTime;
            StringBuilder sb = new StringBuilder();
            foreach (var u in logins)
            {
                string[] us = u.Split(',');
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间登陆了系统<br>", us[0], us[1]));
            }
            avm.LoginActivities = sb.ToString();

            var addUsers = from user in all
                           where user.Operation == "api/ShqUsers/Add"
                           orderby user.CreatedTime descending
                           select user.UserName + "," + user.OperationDetails + "," + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in addUsers)
            {
                string[] us = u.Split(',');
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间创建了新的用户账号<FONT COLOR='black'>{2}</FONT><br>", us[0], us[2], us[1]));
            }
            avm.UserAddActivities = sb.ToString();

            var updateUsers = from user in all
                              where user.Operation == "api/ShqUsers/Update" || user.Operation == "api/ShqUsers/ChangePassword" || user.Operation == "api/ShqUsers/Disable"
                              orderby user.CreatedTime descending
                              select user.UserName + "," + user.OperationDetails + "," + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in updateUsers)
            {
                string[] us = u.Split(',');
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间修改了<FONT COLOR='black'>{2}</FONT><br>", us[0], us[2], us[1]));
            }
            avm.UserUpdatectivities = sb.ToString();

            var addProjects = from user in all
                              where user.Operation == "api/Projects/Add"
                              orderby user.CreatedTime descending
                              select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in addProjects)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间新建了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name));
            }
            avm.ProjectAddActivities = sb.ToString();

            var updateProjects = from user in all
                                 where user.Operation == "api/Projects/Update"
                                 orderby user.CreatedTime descending
                                 select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in updateProjects)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间编辑了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name));
            }
            avm.ProjectUpdateActivities = sb.ToString();

            var updateProjectTrees = from user in all
                                     where user.Operation == "api/FTAProjects/AddTree" || user.Operation == "api/FMEAProjects/AddTree"
                                     orderby user.CreatedTime descending
                                     select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in updateProjectTrees)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间修改了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name));
            }
            avm.ProjectTreeUpdateActivities = sb.ToString();

            var analyzeProjectTrees = from user in all
                                      where user.Operation == "api/FTAProjects/AnalyzeTree"
                                      orderby user.CreatedTime descending
                                      select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            sb = new StringBuilder();
            foreach (var u in analyzeProjectTrees)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                sb.Append(string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间对<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT>运行了FTA分析<br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name));
            }
            avm.ProjectTreeAnalysisActivities = sb.ToString();


            avm.ActivitiesCount = new List<object>();
            using (var con = new MySqlConnection(ConfigurationManager.ConnectionStrings["ShqContext"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = string.Format("SELECT DATE(audits.CreatedTime),audits.Operation,count(*) as num FROM shqdb.audits " +
                                                "group by DATE(audits.CreatedTime), audits.Operation " +
                                                "order by DATE(audits.CreatedTime); ");
                using (var rdr = cmd.ExecuteReader(CommandBehavior.SequentialAccess | CommandBehavior.CloseConnection))
                {
                    while (rdr.Read())
                    {
                        var data = new { date = rdr.GetDateTime(0), operation = rdr.GetString(1), count = rdr.GetDouble(2) };
                        avm.ActivitiesCount.Add(data);
                    }
                }
            }

            return avm;
        }

        // GET: api/Audits/5
        [ResponseType(typeof(Audit))]
        public async Task<IHttpActionResult> GetAudit(Guid id)
        {
            Audit audit = await db.Audits.FindAsync(id);
            if (audit == null)
            {
                return NotFound();
            }

            return Ok(audit);
        }

        [Route("api/Audits/Add")]
        [HttpPost]
        // PUT: api/Audits/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> AddAudit(Audit audit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Entry(audit).State = EntityState.Modified;

            try
            {
                db.Audits.Add(audit);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuditExists(audit.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AuditExists(Guid id)
        {
            return db.Audits.Count(e => e.Id == id) > 0;
        }

        public void AddAuditEntry(string operation, string operationDetails)
        {
            Audit audit = new Audit();
            audit.Id = Guid.NewGuid();
            audit.UserName = HttpContext.Current.User.Identity.Name;
            audit.RequestIP = HttpContext.Current.Request.UserHostAddress;
            audit.Operation = operation;
            audit.OperationDetails = operationDetails;
            audit.Level = 0;
            AddAudit(audit);
        }
    }
}