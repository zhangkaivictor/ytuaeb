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
using Newtonsoft.Json.Linq;

namespace Dxc.Shq.WebApi.Controllers
{
    public class ShqKeywordSetsController : ApiController
    {
        private ShqContext db = new ShqContext();

        // GET: api/ShqKeywordSets/5
        /// <summary>
        /// use keyword to search values
        /// </summary>
        /// <param name="keywords">the keywords must by in a defined format: {"scope":"failureProperty","keywords":"structureNodeName^functionName^failureName^propertyKeyName^property_notcompleteValue"}</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/ShqKeywordSets/Search")]
        public IQueryable<string> GetShqKeywordSet(string keywords)
        {
            dynamic jsonSource = JObject.Parse(keywords);
            if(jsonSource.scope == "failureProperty")
            {
                string keys = jsonSource.keywords;

                string[] keyArray = keys.Split('^');

                // search by the value contain
                string temp = keyArray[4];
                var shqKeywordSet = db.ShqKeywordSets.Where(item => item.KeywordValue.Contains(temp) == true);
                if(shqKeywordSet.Count() <= ShqConstants.MaxSearchCount)
                {
                    return OrderByFrequency(shqKeywordSet);
                }
                else
                {
                    // filter by stucture
                    temp = keyArray[0];
                    var stuctureFilter = shqKeywordSet.Where(item => item.Keyword.Contains(temp));
                    if (stuctureFilter.Count() == 0)
                    {
                        return OrderByFrequency(shqKeywordSet);
                    }
                    else if(stuctureFilter.Count() <= ShqConstants.MaxSearchCount)
                    {
                        return OrderByFrequency(stuctureFilter);
                    }
                    else
                    {
                        // filter by function
                        temp = keyArray[1];
                        var functionFilter = stuctureFilter.Where(item => item.Keyword.Contains(temp));
                        if (functionFilter.Count() == 0)
                        {
                            return OrderByFrequency(stuctureFilter);
                        }
                        else if (functionFilter.Count() <= ShqConstants.MaxSearchCount)
                        {
                            return OrderByFrequency(functionFilter);
                        }
                        else
                        {
                            // filter by failure
                            temp = keyArray[2];
                            var failureFilter = functionFilter.Where(item => item.Keyword.Contains(temp));
                            if (failureFilter.Count() ==0)
                            {
                                return OrderByFrequency(functionFilter);
                            }
                            else if (failureFilter.Count() <= ShqConstants.MaxSearchCount)
                            {
                                return OrderByFrequency(failureFilter);
                            }
                            else
                            {
                                // filter by property key
                                temp = keyArray[3];
                                var propertyKeyFilter = failureFilter.Where(item => item.Keyword.Contains(temp));
                                if (propertyKeyFilter.Count() == 0)
                                {
                                    return OrderByFrequency(failureFilter);
                                }
                                else
                                {
                                    return OrderByFrequency(propertyKeyFilter);
                                }
                            }
                        }
                    }
                    
                }
            }

            return null;
        }

        private IQueryable<string> OrderByFrequency(IQueryable<ShqKeywordSet> input)
        {
            var result = from keyvalues in input
                         group keyvalues by keyvalues.KeywordValue into keyvaluesGroup
                         select new
                         {
                             keyvalue = keyvaluesGroup.Key,
                             Count = keyvaluesGroup.Count(),
                         };

            return result.OrderByDescending(item => item.Count).Select(r => r.keyvalue).Take(ShqConstants.MaxSearchCount);
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