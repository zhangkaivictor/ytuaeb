﻿namespace Dxc.Shq.WebApi.Core
{
    using System.Data.Entity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;

    public class ShqContext : IdentityDbContext
    {
        public ShqContext()
            : base("ShqContext")
        {

        }

        public DbSet<Project> Projects { get; set; }

        public DbSet<FTAProject> FTAProjects { get; set; }

        public DbSet<FMEAProject> FMEAProjects { get; set; }

        public DbSet<WorkProject> WorkProjects { get; set; }

        public DbSet<ShqUser> ShqUsers { get; set; }

        public DbSet<ProjectShqUsers> ProjectShqUsers { get; set; }

        public DbSet<FTANodeType> FTANodeTypes { get; set; }

        public DbSet<FTANodeGateType> FTANodeGateTypes { get; set; }

        public DbSet<FTANode> FTANodes { get; set; }

        public DbSet<FTANodeProperties> FTANodeProperties { get; set; }

        public DbSet<FTANodeGate> FTANodeGates { get; set; }

        public DbSet<FTAEventType> FTAEventTypes { get; set; }

        public DbSet<FTAFailureType> FTAFailureTypes { get; set; }

        public DbSet<FTANodeEventReport> FTANodeEventReports { get; set; }

        public DbSet<FTAProjectReport> FTAEventReports { get; set; }

        public DbSet<FTAAnalysisResultById> FTAAnalysisResultByIds { get; set; }
        public DbSet<FTAAnalysisResultByName> FTAAnalysisResultByNames { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Project>().HasIndex(p => new { p.ProjectName }).IsUnique(true);

            modelBuilder.Entity<WorkProjectTemplate>().HasIndex(w => new { w.Name }).IsUnique(true);

            modelBuilder.Entity<ProjectFile>().HasIndex(w => new { w.FileId, w.WorkProjectId, w.WorkProjectTemplateId }).IsUnique(true);
        }

        public DbSet<WorkProjectTemplate> WorkProjectTemplates { get; set; }


        public DbSet<ProjectFile> ProjectFiles { get; set; }

        public DbSet<ShqDictionary> ShqDictionary { get; set; }

        public DbSet<ShqKeywordSet> ShqKeywordSets { get; set; }

        public DbSet<Audit> Audits { get; set; }
    }
}