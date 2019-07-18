﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Dxc.Shq.WebApi.Models
{
    public class ProjectFile : DataBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        public Guid FileId { get; set; }

        [ForeignKey("WorkProjectTemplate")]
        public Guid? WorkProjectTemplateId { get; set; }

        public WorkProjectTemplate WorkProjectTemplate { get; set; }

        [ForeignKey("WorkProject")]
        public Guid? WorkProjectId { get; set; }

        public WorkProject WorkProject { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public string Level { get; set; }
        
        public int Privilege { get; set; }

        /// <summary>
        /// 1 means deleted
        /// </summary>
        public int Status { get; set; }

        [Required]
        public bool IsFolder { get; set; }

        [Required]
        public string Path { get; set; }
    }
}