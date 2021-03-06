/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */

import {CSVDataset} from './datasets/csv_dataset';
import {URLDataSource} from './sources/url_data_source';
import {CSVConfig} from './types';

/**
 * Create a `CSVDataset` by reading and decoding CSV file(s) from provided URLs.
 *
 * ```js
 * const csvUrl =
 * 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
 *
 * async function run() {
 *   // We want to predict the column "medv", which represents a median value of
 *   // a home (in $1000s), so we mark it as a label.
 *   const csvDataset = tf.data.csv(
 *     csvUrl, {
 *       columnConfigs: {
 *         medv: {
 *           isLabel: true
 *         }
 *       }
 *     });
 *
 *   // Number of features is the number of column names minus one for the label
 *   // column.
 *   const numOfFeatures = (await csvDataset.columnNames()).length - 1;
 *
 *   // Prepare the Dataset for training.
 *   const flattenedDataset =
 *     csvDataset
 *     .map(([rawFeatures, rawLabel]) =>
 *       // Convert rows from object form (keyed by column name) to array form.
 *       [Object.values(rawFeatures), Object.values(rawLabel)])
 *     .batch(10);
 *
 *   // Define the model.
 *   const model = tf.sequential();
 *   model.add(tf.layers.dense({
 *     inputShape: [numOfFeatures],
 *     units: 1
 *   }));
 *   model.compile({
 *     optimizer: tf.train.sgd(0.000001),
 *     loss: 'meanSquaredError'
 *   });
 *
 *   // Fit the model using the prepared Dataset
 *   return model.fitDataset(flattenedDataset, {
 *     epochs: 10,
 *     callbacks: {
 *       onEpochEnd: async (epoch, logs) => {
 *         console.log(epoch);
 *       }
 *     }
 *   });
 * }
 *
 * await run();
 * ```
 *
 * @param source URL to fetch CSV file.
 * @param csvConfig (Optional) A CSVConfig object that contains configurations
 *     of reading and decoding from CSV file(s).
 *
 *     hasHeader: (Optional) A boolean value that indicates whether the first
 *     row of provided CSV file is a header line with column names, and should
 *     not be included in the data. Defaults to `true`.
 *
 *     columnNames: (Optional) A list of strings that corresponds to
 *     the CSV column names, in order. If provided, it ignores the column names
 *     inferred from the header row. If not provided, infers the column names
 *     from the first row of the records. If `hasHeader` is false and
 *     `columnNames` is not provided, this method will throw an error.
 *
 *     columnConfigs: (Optional) A dictionary whose key is column names, value
 *     is an object stating if this column is required, column's data type,
 *     default value, and if this column is label. If provided, keys must
 *     correspond to names provided in `columnNames` or inferred from the file
 *     header lines.
 *
 *     configuredColumnsOnly (Optional) If true, only columns provided in
 *     `columnConfigs` will be parsed and provided during iteration.
 *
 *     delimiter (Optional) The string used to parse each line of the input
 *     file. Defaults to `,`.
 */
export function csv(source: string, csvConfig: CSVConfig = {}): CSVDataset {
  return new CSVDataset(new URLDataSource(source), csvConfig);
}
