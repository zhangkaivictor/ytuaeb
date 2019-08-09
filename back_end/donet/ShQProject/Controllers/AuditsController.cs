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

        /// <summary>
        /// get the report data of user activities
        /// </summary>
        /// <param name="auditsListMaxCount">the max count for the auditsList fields</param>
        /// <param name="auditProjectsMaxcount">the max count for the projectsActivitiesCount fields</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Audits/All")]
        public AuditViewModel GetAudits(int auditsListMaxCount = 30, int auditProjectsMaxcount = 14)
        {
            AuditViewModel avm = new AuditViewModel();

            DateTime last30Days = DateTime.Now - (new TimeSpan(30, 0, 0, 0));
            //var all = db.Audits.Where(item => item.CreatedTime > last30Days);
            var all = db.Audits.OrderByDescending(item => item.CreatedTime).Take(auditsListMaxCount);

            List<dynamic> auditsList = new List<dynamic>();

            string dbContent = "";
            var logins = from user in all
                         where user.Operation == "login"
                         orderby user.CreatedTime descending
                         select user.OperationDetails + "," + user.CreatedTime;
            //StringBuilder //sb = new StringBuilder();
            foreach (var u in logins)
            {
                string[] us = u.Split(',');
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间登陆了系统<br>", us[0], us[1]);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[1] });
            }
            //avm.LoginActivities = sb.ToString();

            var logouts = from user in all
                          where user.Operation == "logout"
                          orderby user.CreatedTime descending
                          select user.OperationDetails + "," + user.CreatedTime;
            ////sb = new StringBuilder();
            foreach (var u in logouts)
            {
                string[] us = u.Split(',');
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间登出了系统<br>", us[0], us[1]);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[1] });
            }
            //avm.LogoutActivities = sb.ToString();

            var addUsers = from user in all
                           where user.Operation == "api/ShqUsers/Add"
                           orderby user.CreatedTime descending
                           select user.UserName + "," + user.OperationDetails + "," + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in addUsers)
            {
                string[] us = u.Split(',');
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间创建了新的用户账号<FONT COLOR='black'>{2}</FONT><br>", us[0], us[2], us[1]);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.UserAddActivities = sb.ToString();

            var updateUsers = from user in all
                              where user.Operation == "api/ShqUsers/Update" || user.Operation == "api/ShqUsers/ChangePassword" || user.Operation == "api/ShqUsers/Disable"
                              orderby user.CreatedTime descending
                              select user.UserName + "," + user.OperationDetails + "," + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in updateUsers)
            {
                string[] us = u.Split(',');
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间修改了<FONT COLOR='black'>{2}</FONT><br>", us[0], us[2], us[1]);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.UserUpdatectivities = sb.ToString();

            var addProjects = from user in all
                              where user.Operation == "api/Projects/Add"
                              orderby user.CreatedTime descending
                              select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in addProjects)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间新建了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.ProjectAddActivities = sb.ToString();

            var updateProjects = from user in all
                                 where user.Operation == "api/Projects/Update"
                                 orderby user.CreatedTime descending
                                 select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in updateProjects)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间编辑了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.ProjectUpdateActivities = sb.ToString();

            var updateProjectTrees = from user in all
                                     where user.Operation == "api/FTAProjects/AddTree" || user.Operation == "api/FMEAProjects/AddTree"
                                     orderby user.CreatedTime descending
                                     select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in updateProjectTrees)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间修改了<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT><br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.ProjectTreeUpdateActivities = sb.ToString();

            var analyzeProjectTrees = from user in all
                                      where user.Operation == "api/FTAProjects/AnalyzeTree"
                                      orderby user.CreatedTime descending
                                      select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            //sb = new StringBuilder();
            foreach (var u in analyzeProjectTrees)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                dbContent = string.Format("<FONT COLOR='black'>{0}</FONT>用户在<FONT COLOR='black'>{1}</FONT>时间对<FONT COLOR='black'>{2}</FONT>类型项目<FONT COLOR='black'>{3}</FONT>运行了FTA分析<br>", us[0], us[2], ShqConstants.GetProjectType(p.Type), p.Name);
                //sb.Append(dbContent);
                auditsList.Add(new { content = dbContent, date = us[2] });
            }
            //avm.ProjectTreeAnalysisActivities = sb.ToString();

            avm.AuditsList = String.Join(" ", auditsList.OrderByDescending(item => item.date).Select(x => x.content).Take(auditsListMaxCount).ToList());

            //avm.ActivitiesCount = new List<object>();
            //using (var con = new MySqlConnection(ConfigurationManager.ConnectionStrings["ShqContext"].ConnectionString))
            //{
            //    con.Open();
            //    var cmd = con.CreateCommand();
            //    cmd.CommandText = string.Format("SELECT DATE(audits.CreatedTime),audits.Operation,count(*) as num FROM shqdb.audits " +
            //                                    "group by DATE(audits.CreatedTime), audits.Operation " +
            //                                    "order by DATE(audits.CreatedTime); ");
            //    using (var rdr = cmd.ExecuteReader(CommandBehavior.SequentialAccess | CommandBehavior.CloseConnection))
            //    {
            //        while (rdr.Read())
            //        {
            //            var data = new { date = rdr.GetDateTime(0), operation = rdr.GetString(1), count = rdr.GetDouble(2) };
            //            avm.ActivitiesCount.Add(data);
            //        }
            //    }
            //}

            var shqUser = db.ShqUsers.Where(u => u.IdentityUser.UserName == HttpContext.Current.User.Identity.Name).FirstOrDefault();
            avm.ProjectsCreateCount = db.Projects.Where(item => item.CreatedById == shqUser.IdentityUserId && item.Status == ShqConstants.ProjectActive).Count();
            avm.ProjectsInvoleCount = db.ProjectShqUsers.Where(item => item.ShqUserId == shqUser.IdentityUserId && item.Privilege > 0 && item.Project.CreatedById != shqUser.IdentityUserId).Count();
            avm.ProjectsInvoleCount += avm.ProjectsCreateCount;


            var projectsAccess = from user in all
                                 where user.Operation.Contains("Projects") == true
                                 orderby user.CreatedTime descending
                                 select user.UserName + "`" + user.OperationDetails + "`" + user.CreatedTime;
            int total = 3;
            string lastProjectName = "";
            avm.LatestEditProjects = "";
            foreach (var u in projectsAccess)
            {
                string[] us = u.Split('`');
                var p = JsonConvert.DeserializeObject<ProjectViewModel>(us[1]);
                if (lastProjectName != p.Name && total > 0)
                {
                    avm.LatestEditProjects += string.Format("<FONT COLOR='black'>{0}</FONT><br>", p.Name);
                    total--;
                }
            }

            avm.ProjectsActivitiesCount = new List<AuditProjectData>();
            DateTime now = DateTime.Now;
            int maxDay = 1 - 1 * auditProjectsMaxcount;
            for (int i = maxDay; i <= 0; i++)
            {
                avm.ProjectsActivitiesCount.Add(new AuditProjectData { date = now.AddDays(i).Date.ToString("yyyy-MM-dd"), ftaCount = 0, fmeaCount = 0, workProjectCount = 0 });
            }

            using (var con = new MySqlConnection(ConfigurationManager.ConnectionStrings["ShqContext"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = string.Format("(select * from ((SELECT date(temp1.CreatedTime) as CreatedTime,'FMEA' as projectType, (select count(*) from fmeaprojects as temp2 where temp2.CreatedTime<=temp1.CreatedTime) as num FROM fmeaprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc) " +
                                                "union all " +
                                                "(SELECT date(temp1.CreatedTime) as CreatedTime, 'FTA' as projectType, (select count(*) from ftaprojects as temp2 where temp2.CreatedTime <= temp1.CreatedTime) as num FROM ftaprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc) " +
                                                "union all " +
                                                "(SELECT date(temp1.CreatedTime) as CreatedTime,'Workproject' as projectType, (select count(*) from workprojects as temp2 where temp2.CreatedTime <= temp1.CreatedTime) as num FROM workprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc)) as groupTemp " +
                                                "where groupTemp.CreatedTime >= '" + now.AddDays(maxDay).Date.ToString("yyyy-MM-dd") + "') " +
                                                "union all " +
                                                "(SELECT date(temp1.CreatedTime) as CreatedTime,'FMEA' as projectType, (select count(*) from fmeaprojects as temp2 where temp2.CreatedTime<=temp1.CreatedTime) as num FROM fmeaprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc limit 1) " +
                                                "union all " +
                                                "(SELECT date(temp1.CreatedTime) as CreatedTime, 'FTA' as projectType, (select count(*) from ftaprojects as temp2 where temp2.CreatedTime <= temp1.CreatedTime) as num FROM ftaprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc  limit 1) " +
                                                "union all " +
                                                "(SELECT date(temp1.CreatedTime) as CreatedTime,'Workproject' as projectType, (select count(*) from workprojects as temp2 where temp2.CreatedTime <= temp1.CreatedTime) as num FROM workprojects as temp1 group by date(temp1.CreatedTime) order by date(temp1.CreatedTime) desc limit 1)"
                                                );
                using (var rdr = cmd.ExecuteReader(CommandBehavior.SequentialAccess | CommandBehavior.CloseConnection))
                {
                    while (rdr.Read())
                    {
                        var data = new { date = rdr.GetDateTime(0).ToString("yyyy-MM-dd"), projectType = rdr.GetString(1), count = rdr.GetInt32(2) };
                        var element = avm.ProjectsActivitiesCount.FirstOrDefault(item => item.date == data.date);
                        if (element == null)
                        {
                            element = new AuditProjectData { date = data.date, ftaCount = 0, fmeaCount = 0, workProjectCount = 0 };
                            avm.ProjectsActivitiesCount.Add(element);
                        }

                        switch (data.projectType)
                        {
                            case "FTA": element.ftaCount = data.count; break;
                            case "FMEA": element.fmeaCount = data.count; break;
                            case "Workproject": element.workProjectCount = data.count; break;
                        }
                    }
                }
            }

            avm.ProjectsActivitiesCount = avm.ProjectsActivitiesCount.OrderBy(item => DateTime.Parse(item.date)).ToList();

            for (int i = avm.ProjectsActivitiesCount.Count - 1; i > 0; i--)
            {
                if (avm.ProjectsActivitiesCount[i].fmeaCount == 0)
                {
                    var last = avm.ProjectsActivitiesCount.Take(i).LastOrDefault(item => item.fmeaCount != 0);
                    if (last != null)
                    {
                        avm.ProjectsActivitiesCount[i].fmeaCount = last.fmeaCount;
                    }
                }

                if (avm.ProjectsActivitiesCount[i].ftaCount == 0)
                {
                    var last = avm.ProjectsActivitiesCount.Take(i).LastOrDefault(item => item.ftaCount != 0);
                    if (last != null)
                    {
                        avm.ProjectsActivitiesCount[i].ftaCount = last.ftaCount;
                    }
                }

                if (avm.ProjectsActivitiesCount[i].workProjectCount == 0)
                {
                    var last = avm.ProjectsActivitiesCount.Take(i).LastOrDefault(item => item.workProjectCount != 0);
                    if (last != null)
                    {
                        avm.ProjectsActivitiesCount[i].workProjectCount = last.workProjectCount;
                    }
                }

            }

            if (avm.ProjectsActivitiesCount.Count > auditProjectsMaxcount)
            {
                avm.ProjectsActivitiesCount = avm.ProjectsActivitiesCount.GetRange(avm.ProjectsActivitiesCount.Count - auditProjectsMaxcount, auditProjectsMaxcount);
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