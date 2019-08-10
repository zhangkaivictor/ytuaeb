using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Dxc.Shq.WebApi.Models
{
    public class Audit
    {
        [Key]
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public string RequestIP { get; set; }

        public string Operation { get; set; }

        public string OperationDetails { get; set; }

        public int Level { get; set; }

        public DateTime CreatedTime { get; set; } = DateTime.Now;
    }
}