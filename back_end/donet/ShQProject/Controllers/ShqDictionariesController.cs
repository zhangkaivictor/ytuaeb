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
    public class ShqDictionariesController : ApiController
    {
        private ShqContext db = new ShqContext();

        /// <summary>
        /// GetShqDictionaryAll
        /// </summary>
        /// <param name="lastModifiedDate">the max last modified date</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/ShqDictionaries/all")]
        public IQueryable<ShqDictionary> GetShqDictionaryAll(string lastModifiedDate)
        {
            if (string.IsNullOrEmpty(lastModifiedDate) == true)
            {
                return db.ShqDictionary.AsQueryable();
            }
            else
            {
                DateTime lastDate = DateTime.Parse(lastModifiedDate);
                var item = db.ShqDictionary.Where(row => row.LastModfiedTime > lastDate);
                if (item != null && item.Count() > 0)
                {
                    return db.ShqDictionary.AsQueryable();
                }
                else
                {
                    return null;
                }
            }
        }


        /// <summary>
        /// to get pre-defined Dictionary
        /// </summary>
        /// <param name="groupName">the category name , for the work project file level is "projectFileLevel"</param>
        /// <param name="lastModifiedDate">the max last modified date</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/ShqDictionaries")]
        public IQueryable<ShqDictionary> GetShqDictionary(string groupName, string lastModifiedDate="2010-1-1")
        {

            if (string.IsNullOrEmpty(lastModifiedDate) == true)
            {
                return db.ShqDictionary.Where(item => item.GroupName == groupName);
            }
            else
            {
                DateTime lastDate = DateTime.Parse(lastModifiedDate);
                var row = db.ShqDictionary.Where(item => item.GroupName == groupName && item.LastModfiedTime > lastDate);
                if (row != null && row.Count() > 0)
                {
                    return db.ShqDictionary.Where(item => item.GroupName == groupName);
                }
                else
                {
                    return null;
                }
            }
        }

        [HttpGet]
        [Route("api/ShqDictionaries/Add")]
        public ShqDictionary AddShqDictionary(string groupName, string dictName, string dictValue)
        {
            var row = db.ShqDictionary.FirstOrDefault(item => item.GroupName == groupName && item.DictName == dictName && item.DictValue == dictValue);
            if (row != null)
            {
                row.DictValue = dictValue;
            }
            else
            {
                row = db.ShqDictionary.Add(new ShqDictionary() { GroupName = groupName, DictName = dictName, DictValue = dictValue });
            }

            db.SaveChanges();

            return row;
        }

        //// PUT: api/ShqDictionaries/5
        //[ResponseType(typeof(void))]
        //public async Task<IHttpActionResult> PutShqDictionary(int id, ShqDictionary shqDictionary)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != shqDictionary.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(shqDictionary).State = EntityState.Modified;

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ShqDictionaryExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/ShqDictionaries
        //[ResponseType(typeof(ShqDictionary))]
        //public async Task<IHttpActionResult> PostShqDictionary(ShqDictionary shqDictionary)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.ShqDictionary.Add(shqDictionary);
        //    await db.SaveChangesAsync();

        //    return CreatedAtRoute("DefaultApi", new { id = shqDictionary.Id }, shqDictionary);
        //}

        //// DELETE: api/ShqDictionaries/5
        //[ResponseType(typeof(ShqDictionary))]
        //public async Task<IHttpActionResult> DeleteShqDictionary(int id)
        //{
        //    ShqDictionary shqDictionary = await db.ShqDictionary.FindAsync(id);
        //    if (shqDictionary == null)
        //    {
        //        return NotFound();
        //    }

        //    db.ShqDictionary.Remove(shqDictionary);
        //    await db.SaveChangesAsync();

        //    return Ok(shqDictionary);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ShqDictionaryExists(int id)
        {
            return db.ShqDictionary.Count(e => e.Id == id) > 0;
        }
    }
}