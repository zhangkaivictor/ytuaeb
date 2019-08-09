using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dxc.Shq.WebApi.ViewModels
{
    public class AuditProjectData
    {
        public string date { get; set; }
        public int ftaCount { get; set; }
        public int fmeaCount { get; set; }
        public int workProjectCount { get; set; }
    }

    public class AuditViewModel
    {
        public string AuditsList { get; set; }

        public int ProjectsCreateCount { get; set; }
        public int ProjectsInvoleCount { get; set; }
        public string LatestEditProjects { get; set; }

        public List<AuditProjectData> ProjectsActivitiesCount { get; set; }
        //public string LoginActivities { get; set; }
        //public string LogoutActivities { get; set; }
        //public string UserAddActivities { get; set; }

        //public string UserUpdatectivities { get; set; }
        //public string ProjectAddActivities { get; set; }

        //public string ProjectUpdateActivities { get; set; }

        //public string ProjectTreeUpdateActivities { get; set; }

        //public string ProjectTreeAnalysisActivities { get; set; }

        //public List<object> ActivitiesCount { get; set; }
    }
}