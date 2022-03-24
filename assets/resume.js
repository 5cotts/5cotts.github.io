// Inspired by:
// https://thetizzo.com/howto/2018/01/02/building-an-online-resume-with-jekyll-and-pdfmake

'use strict';

$(document).ready(function() {
  var generateResume = function() {
    const d = new Date();

    var resumeContent = $.parseJSON($('#resumeJson').text());
    var technicalCompetencies = resumeContent['technicalCompetencies'];
    var workExperience = resumeContent['workExperience'];
    var personalProjects = resumeContent['personalProjects'];
    var education = resumeContent['education'];

    var shortDate = function(dateObj, separator) {
      // Month is zero indexed.
      const [month, day, year] = [dateObj.getMonth() + 1, dateObj.getDate(), dateObj.getFullYear()];
      return year + separator + month + separator + day;
    }

    var footer = function(dateObj) {
      return { 
        text: 'Generated ' + shortDate(dateObj, '/'),
        italics: true, 
        alignment: 'right', 
        margin: [0, 0, 45, 0],
        fontSize: 10,
      };
    }

    var docDefinition = {
      content: [],
      footer: function(currentPage, pageCount) {                 
        if (currentPage == pageCount)
            return footer(d);
      },
      // https://github.com/bpampuch/pdfmake/issues/892
      pageBreakBefore(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.pageNumbers.length > 1 && currentNode.unbreakable;
      },
      styles: {
        name: {
          fontSize: 30,
          bold: true
        },
        section_heading: {
          fontSize: 15,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        company_name: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        project_heading: {
          fontSize: 10,
          bold: true
        },
        work_title: {
          fontSize: 10,
        },
        blurb: {
          fontSize: 10,
        },
        bullet_point: {
          fontSize: 10,
        },
        link: {
          color: 'blue',
        },
        positions_stack: {
          margin: [15, 0, 15, 0],
        }
      }
    };

    var content = docDefinition['content']

    var sectionHeading = function(text, options) {
      return { text: text, style: 'section_heading' };
    };

    var list = function(items) {
      if (items === undefined) {
        return {};
      }
      return { ul: items, margin: [20, 5, 20, 5] };
    };

    var headerLine = function() {
      content.push({
        canvas: [{
          type: 'line',
          x1: 0, y1: 6, x2: 595-2*40, y2: 6,
          lineWidth: 1
        }]
      });
    };

    var dashedHeaderLine = function() {
      content.push({
        canvas: [{
          type: 'line',
          x1: 100, y1: 20, x2: 495-2*40, y2: 20,
          dash: { length: 1 },
          lineWidth: 1
        }]
      });
    };

    var shortUrl = function(rawUrl) {
        let url = new URL(rawUrl);
        return url.hostname;
    }

    var header = function() {
      if (!resumeContent || !resumeContent['name']) {
        return 0;
      }
        content.push({ 
          text: resumeContent['name'].toLowerCase(),
          style: 'name',
          alignment: 'left',
        });

        content.push({
            stack: [
                { text: resumeContent['title'].toLowerCase(), italics: true },
                { text: resumeContent['email'] },
                { text: shortUrl(resumeContent['website']), link: resumeContent['website'], style: 'link' },
            ],
            alignment: 'right',
            margin: [0, -45, 0, 0],
            fontSize: 10,
        });
      
      return 1;
    };

    var about = function() {
      if (!resumeContent || !resumeContent['about']) {
        return 0;
      }

      content.push({ text: resumeContent['about'], italics: true, margin: [0, 5, 0, 0] });
      return 1;
    };

    var workExperienceSection = function() {
        if (!workExperience || !workExperience.length) {
            return 0;
        };

        content.push(sectionHeading('work experience'));

        $.each(workExperience, function(i, job) {
            content.push({ 
              text: job['companyName'], 
              link: job['companyUrl'], 
              style: 'company_name',
            });

            if (job['companyBlurb']) {
              content.push({ 
                text: job['companyBlurb'],
                style: 'blurb',
                margin: [0, 0, 0, 5],
              });
            }

            var positionsStack = [];
            $.each(job['positions'], function(i, position) {
              let title = {
                text: [
                      { text: position['title'], bold: true},
                      ' | ',
                      position['startDate'] + '-' + position['endDate']
                  ],
                  style: 'work_title',
              };

              let blurb = { 
                text: position['blurb'],
                margin: [0, 5, 0, 2],
                style: 'blurb' 
              };

              let ulArray = [];
              position['bulletPoints'].forEach(function(bulletPoint) {
                ulArray.push({ text: bulletPoint, style: 'bullet_point'});
              });
              let bulletPoints = list(ulArray);

              for (let part of [title, blurb, bulletPoints]) {
                positionsStack.push(part);
              }
            });

            content.push({ stack: positionsStack, style: 'positions_stack' });
        });

        return 1;
    }

    var personProjectsSection = function() {
        if (!personalProjects || !personalProjects.length) {
          return 0;
        };

        var personalProjectsHeading = sectionHeading('personal projects');
        content.push(personalProjectsHeading);

        $.each(personalProjects, function(i, project) {
          if (project['projectUrl']) {
            content.push({
              stack: [
                {
                  text: [
                    { text: project['projectName'], style: 'project_heading' },
                    { text: ' | ', bold: true }, 
                    { text: shortUrl(project['projectUrl']), link: project['projectUrl'], style: 'link' },
                  ]
                },
                { text: project['blurb'], margin: [0, 5, 0, 0] }
              ],
              margin: [0, 15, 0, 5]
            });
          } else {
            content.push({
              stack: [
                { text: project['projectName'], style: 'project_heading' },
                { text: project['blurb'], margin: [0, 5, 0, 0] },
              ],
              margin: [0, 15, 0, 5]
            });
          }
        });

        return 1;
    }

    var technicalCompetenciesSection = function() {
        if (!technicalCompetencies || !technicalCompetencies.length) {
            return 0;
        };
        
        var skillsTable = [[],[]];
        var widthsArray = [];

        $.each(technicalCompetencies, function(i, skillsData) {
            skillsTable[0].push([{ text: skillsData['skill'], style: 'project_heading'}]);
            skillsTable[1].push([{ stack: skillsData['examples'], style: 'bullet_point' }]);
            widthsArray.push('*')
        });

        // TODO(Scott): Should all sections be stacks?
        content.push({
          stack: [
            sectionHeading('technical competencies'),
            {
              table: {
                  widths: widthsArray,
                  body: skillsTable,
              },
              margin: [0, 10, 0, 0],
              layout: 'noBorders',
            }
          ],
          unbreakable: true,
        });

      return 1;
    }

    var eduSection = function() {
        if (!education || !education.length) {
            return 0;
        };

        content.push(sectionHeading('education'));

        $.each(education, function(i, edu) {
            let date = (
              edu['endDate'] ? 
                `${edu['startDate']}-${edu['endDate']}` : `${edu['startDate']}-present`
            );
            content.push({
                stack: [
                  {
                    text: [
                      { text: edu['eduInstitution'], style: 'project_heading', link: edu['eduUrl'] },
                      ' | ',
                      date,
                    ],
                    style: 'work_title', 
                  },
                  { text: edu['eduLevel'], italics: true },
                  { text: edu['eduName'] },
                  { text: edu['blurb'] ? edu['blurb'] : null}
                ],
                margin: [0, 15, 0, 0],
                style: 'bullet_point',
            });
        });

        return 1;
    }

    // TODO(Scott): Each of these functions below could take content as an argument,
    // and the respective section's data.
    // Add more sections to the below if necessary.
    var orderedSectionSeparatorPairs = [
      [header, headerLine],
      [about, null],
      [workExperienceSection, dashedHeaderLine],
      [personProjectsSection, dashedHeaderLine],
      // [technicalCompetenciesSection, dashedHeaderLine],
      [eduSection, headerLine],
    ];

    orderedSectionSeparatorPairs.forEach(function (pair) {
      var [sectionGenerator, separatorGenerator] = [pair[0], pair[1]];
      var is_generated = sectionGenerator();
      if (is_generated) {
        if (separatorGenerator) {
          separatorGenerator();
        }
      }
    })

    return pdfMake.createPdf(docDefinition).download('resume_' + shortDate(d, '_') + '.pdf');
  };

  $('[data-toggle=download-pdf]').on('click', function(e) {
    e.preventDefault();
    generateResume();
  });
});
