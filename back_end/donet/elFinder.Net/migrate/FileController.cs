﻿using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using ElFinder;

namespace Dxc.Shq.WebApi.Controllers
{
    public class FileController : Controller
    {
        public virtual ActionResult Index(string folder, string subFolder)
        {
            var driver = new FileSystemDriver();

            var root = new Root(new DirectoryInfo(Server.MapPath("~/Content/" + folder)), 
                "http://" + Request.Url.Authority + "/Content/" + folder + "/")
            {
                IsReadOnly = false,
                Alias = "Root", 
                MaxUploadSizeInMb = 500,
                LockedFolders = new List<string>()
            };

            if (!string.IsNullOrEmpty(subFolder))
            {
                root.StartPath = new DirectoryInfo(Server.MapPath("~/Content/" + folder + "/" + subFolder));
            }

            driver.AddRoot(root);
            var connector = new Connector(driver);
            return connector.Process(HttpContext.Request);
        }

        public virtual ActionResult SelectFile(string target)
        {
            var driver = new FileSystemDriver();

            driver.AddRoot(
                new Root(
                    new DirectoryInfo(Server.MapPath("~/Content")),
                    "http://" + Request.Url.Authority + "/Content")
                { IsReadOnly = false });

            var connector = new Connector(driver);

            return Json(connector.GetFileByHash(target).FullName);
        }
    }
}
