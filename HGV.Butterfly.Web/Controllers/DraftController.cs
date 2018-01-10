using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HGV.Butterfly.Web.Controllers
{
    public class DraftController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Strength()
        {
            return View();
        }
    }
}