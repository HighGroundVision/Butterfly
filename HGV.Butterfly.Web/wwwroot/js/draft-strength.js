function linearRegression(y, x) {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;

    return lr;
}

$(document).ready(function () {
    // ~/Draft/Strength?r=71,1,63,101,29&d=46,57,33,17,54

    $.get("/data/hero_winrate_duration.json", function (data) {
        var template = [600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4800, 5100];

        //var radiantSelection = [71, 1, 63, 101, 29];
        //var direSelection = [46, 57, 33, 17, 54];

        var url = new URL(window.location);
        var radiantSelection = url.searchParams.get("r").split(',');
        var direSelection = url.searchParams.get("d").split(',');

        var radiantResults = { "600": 0.0, "900": 0.0, "1200": 0.0, "1500": 0.0, "1800": 0.0, "2100": 0.0, "2400": 0.0, "2700": 0.0, "3000": 0.0, "3300": 0.0, "3600": 0.0, "3900": 0.0, "4200": 0.0, "4800": 0.0, "5100": 0.0 };
        var direResults = { "600": 0.0, "900": 0.0, "1200": 0.0, "1500": 0.0, "1800": 0.0, "2100": 0.0, "2400": 0.0, "2700": 0.0, "3000": 0.0, "3300": 0.0, "3600": 0.0, "3900": 0.0, "4200": 0.0, "4800": 0.0, "5100": 0.0 };

        $.each(template, function (i, key) {
            $.each(radiantSelection, function (r, id) {
                radiantResults[key] += data[id][key];
            });

            $.each(direSelection, function (r, id) {
                direResults[key] += data[id][key];
            });
        });

        $.each(template, function (i, key) {
            radiantResults[key] = radiantResults[key] / 5;
            direResults[key] = direResults[key] / 5;
        });

        var radiantTotals = template.map(function (key) { return radiantResults[key]; });
        var direTotals = template.map(function (key) { return direResults[key]; });

        var radiantRegression = linearRegression(radiantTotals, template);
        var direRegression = linearRegression(direTotals, template);

        var cross = (direRegression.intercept - radiantRegression.intercept) / (radiantRegression.slope - direRegression.slope); 
        var duration = moment.duration(cross, 'seconds');
        var length = Math.round(duration.asMinutes());

        var radaintStart = Math.round(radiantRegression.intercept * 100);
        var direStart = Math.round(direRegression.intercept * 100);

        var result = "";

        if (radaintStart > direStart) {
            if (radiantRegression.slope > 0) {
                result = '<span class="team-radaint">Radiant</span> stronger team then <span class="team-dire">Dire</span>.';
            } else {
                result = '<span class="team-radaint">Radiant</span> starts stronger then <span class="team-dire">Dire</span>, but falls off after ' + length + ' minutes.';
            }
        } else {
            if (direRegression.slope > 0) {
                result = '<span class="team-dire">Dire</span> stronger team then <span class="team-radaint">Radiant</span>';
            } else {
                result = '<span class="team-dire">Dire</span> starts stronger then <span class="team-radaint">Radiant</span>, but falls off after ' + length + ' minutes.';
            }
        }

        $("#Results > div").html(result);
    });
    
});