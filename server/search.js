/**
 * @created 21.04.16
 *
 * @author Popov Nikolay <cejixo3dr@gmail.com>
 * @copyright Beeplans 2016
 */

var htmlParser = require("htmlparser2"),
//async = require('asyncawait/async'),
//await = require('asyncawait/await'),
    fs = require('fs'),
    Promise = require('promise'),
    request = require("request"),
    http = require("http"),
    jsdom = require("jsdom");

(function () {
    'use strict';

    class SearchApplication {
        /**
         *
         * @param params
         */
        constructor(params) {

            this.urlSettings = {
                uri: 'http://fs.to/search.aspx',
                params: params.map((currentValue)=> {
                    if (currentValue.indexOf('--') === 0) {
                        currentValue = currentValue.substring(2);
                    }
                    return {
                        key: currentValue.split('=')[0],
                        value: currentValue.split('=')[1]
                    }
                }),
                /**
                 *
                 * @returns {string}
                 */
                getUrl: function () {
                    let parseParams = function (params) {
                        return params.reduce((previousValue, currentValue) => {
                            return previousValue + '&' + currentValue.key + '=' + encodeURIComponent(currentValue.value);
                        }, '')
                    };
                    return this.uri + '?' + parseParams(this.params);
                }
            };

        };

        /**
         *
         */
        run() {
            let results = [];
            var jquery = fs.readFileSync("./server/jquery-2.2.3.min.js");
            jsdom.env({
                    url: this.urlSettings.getUrl(),
                    src: [jquery],
                    done: function (err, window) {
                        let $ = window.$;
                        let items = $("body").find('.b-search-page__results-item')
                            .each((index, value)=> {
                                let jValue = $(value);
                                let result = {
                                    url: jValue.attr('href'),
                                    type: jValue.data('subsection'),
                                    title: jValue.find('.b-search-page__results-item-title').text(),
                                    description: jValue.find('.b-search-page__results-item-description').text(),
                                    img: jValue.find('.b-search-page__results-item-image img').attr('src'),
                                    positive: parseInt(jValue.find('.b-search-page__results-item-rating-positive').text()),
                                    negative: parseInt(jValue.find('.b-search-page__results-item-rating-negative').text())

                                };
                                results.push(result);
                            });
                        fs.writeFile('response.json', JSON.stringify(results));

                    }
                }
            );

        }
    }


    (new SearchApplication(process.argv.slice(2, process.argv.length)))
        .run();

}());



