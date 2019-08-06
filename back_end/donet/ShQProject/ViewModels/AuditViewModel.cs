using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dxc.Shq.WebApi.ViewModels
{
    public class AuditViewModel
    {
        public string LoginActivities { get; set; }
        public string UserAddActivities { get; set; }

        public string UserUpdatectivities { get; set; }
        public string ProjectAddActivities { get; set; }

        public string ProjectUpdateActivities { get; set; }

        public string ProjectTreeUpdateActivities { get; set; }

        public string ProjectTreeAnalysisActivities { get; set; }

        public List<object> ActivitiesCount { get; set; }
    }
}