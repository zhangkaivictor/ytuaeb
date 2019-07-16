using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Web.Mvc;
using ElFinder;

namespace Dxc.Shq.WebApi.Controllers
{
    public class FileController : Controller
    {
        private static string Gpath = @"C:\";

        public virtual ActionResult Index(string folder, string subFolder)
        {
            folder = "release";
            var driver = new FileSystemDriver();

            var root = new Root(new DirectoryInfo(FileController.Gpath + folder),
                "http://" + Request.Url.Authority + "/" + folder + "/")
            {
                IsReadOnly = false,
                Alias = "Root",
                MaxUploadSizeInMb = 500,
                LockedFolders = new List<string>()
            };

            if (!string.IsNullOrEmpty(subFolder))
            {
                root.StartPath = new DirectoryInfo(FileController.Gpath + folder + "/" + subFolder);
            }

            driver.AddRoot(root);
            var connector = new Connector(driver);

            NameValueCollection parameters = HttpContext.Request.QueryString.Count > 0 ? HttpContext.Request.QueryString : HttpContext.Request.Form;
            string cmdName = parameters["cmd"];
            if (cmdName != "file")
            {
                return connector.Process(HttpContext.Request);
            }
            {
                return null;
            }

        }

        public virtual ActionResult SelectFile(string target)
        {
            var driver = new FileSystemDriver();

            driver.AddRoot(
                new Root(
                    new DirectoryInfo(FileController.Gpath),
                    "http://" + Request.Url.Authority + "/")
                { IsReadOnly = false });

            var connector = new Connector(driver);

            return Json(connector.GetFileByHash(target).FullName);
        }
    }
}
