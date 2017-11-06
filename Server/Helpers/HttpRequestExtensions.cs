using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SimpleTodoList.Server.Models;

namespace SimpleTodoList.Server.Helpers {
  public static class HttpRequestExtensions {
    public static SimpleRequest AbstractRequestInfo(this HttpRequest request) {
      var requestSimplified = new SimpleRequest {
        Cookies = request.Cookies,
        Headers = request.Headers,
        Host = request.Host
      };
      
      return requestSimplified;
    }

    public static async Task<RenderToStringResult> BuildPrerender(this HttpRequest request) {
      var nodeServices = request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
      var hostEnv = request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();

      string applicationBasePath = hostEnv.ContentRootPath;
      var requestFeature = request.HttpContext.Features.Get<IHttpRequestFeature>();
      string unencodedPathAndQuery = requestFeature.RawTarget;
      var unencodedAbsoluteUrl = $"{request.Scheme}://{request.Host}{unencodedPathAndQuery}";

      // By default we're passing down Cookies, Headers, Host from the Request object here
      var transferData = new TransferData {
        Request = request.AbstractRequestInfo(),
        ThisCameFromDotNet = "Hi Angular it's asp.net :)"
      };
      // TODO: Add more customData here, add it to the TransferData class

      var cancelSource = new CancellationTokenSource();
      CancellationToken cancelToken = cancelSource.Token;

      // Prerender / Serialize application (with Universal)
      return await Prerenderer.RenderToString(
        "/",
        nodeServices,
        cancelToken,
        new JavaScriptModuleExport(applicationBasePath + "/ClientApp/dist/main-server"),
        unencodedAbsoluteUrl,
        unencodedPathAndQuery,
        transferData, // Our simplified Request object & any other CustommData you want to send!
        30000,
        request.PathBase.ToString()
      );
    }
  }
}
