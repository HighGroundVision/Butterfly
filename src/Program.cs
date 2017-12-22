using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace HGV.Butterfly.Console
{
    class Program
    {
        static void SeedCounts(Dictionary<int, Dictionary<int, int>> matchesCount)
        {
            for (int m = 0; m <= 23; m++)
            {
                var week = new Dictionary<int, int>();
                for (int w = 0; w <= 6; w++)
                    week.Add(w, 0);

                matchesCount.Add(m, week);
            }
        }

        static async Task OutputCounts(Dictionary<int, Dictionary<int, int>> matchesCount)
        {
            using (var fileHandler = System.IO.File.CreateText("MatchCounts.csv"))
            using (var csvWriter = new CsvHelper.CsvWriter(fileHandler))
            {
                csvWriter.WriteField("Mode");
                csvWriter.WriteField("Sunday");
                csvWriter.WriteField("Monday");
                csvWriter.WriteField("Tuesday");
                csvWriter.WriteField("Wednesday");
                csvWriter.WriteField("Thursday");
                csvWriter.WriteField("Friday");
                csvWriter.WriteField("Saturday");
                await csvWriter.NextRecordAsync();

                foreach (var group in matchesCount)
                {
                    csvWriter.WriteField(group.Key);

                    for (int w = 0; w <= 6; w++)
                    {
                        csvWriter.WriteField(group.Value[w]);
                    }

                    await csvWriter.NextRecordAsync();
                }

            }
        }

        static async Task GetMatches()
        {
            var key = "4932A809199A74AB6833EDFD9BADC176";

            var matchesCount = new Dictionary<int, Dictionary<int, int>>();
            SeedCounts(matchesCount);

            using (var client = new HGV.Daedalus.DotaApiClient(key))
            {
                var lastest = await client.GetLastestMatches();
                var sequence = lastest.Max(_ => _.match_seq_num);

                while (true)
                {
                    try
                    {
                        System.Console.WriteLine("Batch: {0}", sequence);

                        var matches = await client.GetMatchesInSequence(sequence);
                        foreach (var match in matches)
                        {
                            if (sequence < match.match_seq_num)
                                sequence = match.match_seq_num;

                            var match_date = new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime().AddSeconds(match.start_time);
                            matchesCount[match.game_mode][(int)match_date.DayOfWeek]++;
                        }

                        await OutputCounts(matchesCount);

                        // Thread.Sleep(TimeSpan.FromSeconds(1));
                    }
                    catch (Exception ex)
                    {
                        Thread.Sleep(TimeSpan.FromSeconds(30));
                    }
                }
            }
        }

        static void Main(string[] args)
        {
            var task = Task.Run(GetMatches);
            task.Wait();
        }
    }
}
