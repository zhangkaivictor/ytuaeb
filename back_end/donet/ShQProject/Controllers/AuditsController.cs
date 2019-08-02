using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using Dxc.Shq.WebApi.Core;
using Dxc.Shq.WebApi.Models;

namespace Dxc.Shq.WebApi.Controllers
{
    public class AuditsController : ApiController
    {
        private ShqContext db = new ShqContext();

        // GET: api/Audits
        public IQueryable<Audit> GetAudits()
        {
            return db.Audits;
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