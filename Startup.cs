using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using SimpleTodoBoard.Data;
using Swashbuckle.AspNetCore.Swagger;

namespace SimpleTodoBoard {
  public class Startup {
    public static void Main(string[] args) {
      var host = new WebHostBuilder()
        .UseKestrel()
        .UseContentRoot(Directory.GetCurrentDirectory())
        .UseIISIntegration()
        .UseStartup<Startup>()
        .Build();

      host.Run();
    }

    public Startup(IHostingEnvironment env) {
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json", true, true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
        .AddEnvironmentVariables();

      Configuration = builder.Build();
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
      // Add framework services.
      services.AddMvc();
      services.AddNodeServices();

      var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = "spa.db" };
      var connectionString = connectionStringBuilder.ToString();

      services.AddDbContext<SpaDbContext>(options =>
        options.UseSqlite(connectionString));

      // Register the Swagger generator, defining one or more Swagger documents
      services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new Info {Title = "My Todo List API", Version = "v1"});
      });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, SpaDbContext context) {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseStaticFiles();

      DbInitializer.Initialize(context);

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
          HotModuleReplacement = true,
          HotModuleReplacementEndpoint = "/dist/__webpack_hmr"
        });
        app.UseSwagger();
        app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Todo List API"); });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
        app.MapWhen(x => !x.Request.Path.Value.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase), builder => {
          builder.UseMvc(routes => {
            routes.MapSpaFallbackRoute(
              "spa-fallback",
              new {controller = "Home", action = "Index"});
          });
        });
      } else {
        app.UseMvc(routes => {
          routes.MapRoute(
            "default",
            "{controller=Home}/{action=Index}/{id?}");

          routes.MapRoute(
            "Sitemap",
            "sitemap.xml",
            new {controller = "Home", action = "SitemapXml"});

          routes.MapSpaFallbackRoute(
            "spa-fallback",
            new {controller = "Home", action = "Index"});
        });
        app.UseExceptionHandler("/Home/Error");
      }
    }

    // for the EF tooling
    // see: https://wildermuth.com/2017/07/06/Program-cs-in-ASP-NET-Core-2-0
    // seealso: https://github.com/aspnet/EntityFrameworkCore/issues/9415
    public static IWebHost BuildWebHost(string[] args) {
      return WebHost.CreateDefaultBuilder()
        .ConfigureAppConfiguration((ctx, cfg) => {
          cfg.SetBasePath(Directory.GetCurrentDirectory())
            .AddEnvironmentVariables();
        })
        .ConfigureLogging((ctx, logging) => {}) // No logging
        .UseStartup<Startup>()
        .UseSetting("DesignTime", "true")
        .Build();
    }
  }
}
