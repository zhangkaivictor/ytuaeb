using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Http;

namespace Dxc.Shq.WebApi.Controllers
{
    public class AccountsController : ApiController
    {
        [HttpGet]
        [Route("api/Accounts/Signout")]
        public IHttpActionResult Signout()
        {
            var owinContext = HttpContext.Current.Request.GetOwinContext();
            var authenticationTypes = owinContext.Authentication.GetAuthenticationTypes();
            owinContext.Authentication.SignOut(authenticationTypes.Select(o => o.AuthenticationType).ToArray());

            (new AuditsController()).AddAuditEntry("logout", HttpContext.Current.User.Identity.Name);

            HttpContext.Current.User = new GenericPrincipal(new GenericIdentity(string.Empty), null);

            return Ok();
        }
    }
}
