import fs from "fs";
import csv from "csv-parser";

export async function readCSV(filePath: string): Promise<any[]> { //it takes a csv file from its path
  const results: any[] = []; //store all rows of csv file data in to array

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))//push data to results array
      .on("end", () => resolve(results)) //.on is method of fs.createReadStream, When this event happens, execute this function
      .on("error", reject);
  });
}