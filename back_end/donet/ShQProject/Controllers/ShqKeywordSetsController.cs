using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Dxc.Shq.WebApi.Core;
using Dxc.Shq.WebApi.Models;

namespace Dxc.Shq.WebApi.Controllers
{
    public class ShqKeywordSetsController : ApiController
    {
        private ShqContext db = new ShqContext();

        // GET: api/ShqKeywordSets/5
        [ResponseType(typeof(ShqKeywordSet))]
        public async Task<IHttpActionResult> GetShqKeywordSet(int id)
        {
            ShqKeywordSet shqKeywordSet = await db.ShqKeywordSets.FindAsync(id);
            if (shqKeywordSet == null)
            {
                return NotFound();
            }

            return Ok(shqKeywordSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ShqKeywordSetExists(int id)
        {
            return db.ShqKeywordSets.Count(e => e.Id == id) > 0;
        }
    }
}