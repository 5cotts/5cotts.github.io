// TODO(Scott): May want to manually add line breaks. Or figure out dynamic line breaks.
// Otherwise, the resume might get split in strange positions.

'use strict';

$(document).ready(function() {
  var generateResume = function() {
    var resumeContent = $.parseJSON($('#resumeJson').text());
    var technicalCompetencies = resumeContent['technicalCompetencies'];
    var workExperience = resumeContent['workExperience'];
    var personalProjects = resumeContent['personalProjects'];
    var education = resumeContent['education'];

    var docDefinition = {
      content: [],
      // TODO(Scott): Add a style for URL links?
      styles: {
        name: {
          fontSize: 40,
          bold: true
        },
        section_heading: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        company_name: {
          fontSize: 15,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        project_heading: {
          fontSize: 15,
          bold: true
        },
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
      return { ul: items, margin: [20, 0, 20, 0] };
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
        content.push({ text: resumeContent['name'].toLowerCase(), style: 'name'});

        content.push({
            stack: [
                { text: resumeContent['title'].toLowerCase(), italics: true },
                { text: resumeContent['email'] },
                { text: shortUrl(resumeContent['website']), link: resumeContent['website'] },
            ],
            alignment: 'right',
            margin: [0, -45, 0, 0]
        });

        headerLine();
    };

    var workExperienceSection = function() {
        if (workExperience && workExperience.length) {
            content.push(sectionHeading('work experience'));
        };

        $.each(workExperience, function(i, job) {
            content.push({ text: job['companyName'], style: 'company_name' });
            $.each(job['positions'], function(i, position) {
                content.push({
                    text: [
                        { text: position['title'], bold: true },
                        ' ',
                        position['startDate'] + '-' + position['endDate']
                    ]
                    });
                    content.push({ text: position['blurb'], margin: [0, 5, 0, 0]});
                    content.push(list(position['bulletPoints']));
                    content.push('\n');
                });
        });
    }

    var personProjectsSection = function() {
        if (personalProjects && personalProjects.length) {
            var personalProjectsHeading = sectionHeading('personal projects');
            content.push(personalProjectsHeading);
        };

        $.each(personalProjects, function(i, project) {
            content.push({
                stack: [
                { text: project['projectName'], style: 'project_heading' },
                { text: project['blurb'], margin: [0, 5, 0, 0] }
                ],
                margin: [0, 15, 0, 5]
            });

            var items = []
            if (project['projectUrl']) {
                items.push({
                    text: [
                        { text: 'Project URL: ', bold: true },
                        { text: shortUrl(project['projectUrl']) , link: project['projectUrl'] }
                    ]
                });
            }

            content.push(list(items));
        });
    }

    var technicalCompetenciesSection = function() {
        if (technicalCompetencies && technicalCompetencies.length) {
            content.push(sectionHeading('technical competencies'));
        };

        var skillsTable = [[],[]];        {
            "projectName": "Private Chat Server",
            "projectUrl": "https://friends.scottschmidt.io/",
            "blurb": "Using the open source Rocket.Chat platform, I manage my own private chat server on AWS to keep in touch with my friends. I was inspired to do this in order to keep my digital footprint more secure and in my control."
        } 

        $.each(technicalCompetencies, function(i, skillsData) {
            skillsTable[0].push([{ text: skillsData['skill'], style: 'project_heading'}]);
            skillsTable[1].push([{ stack: skillsData['examples'] }]);
        });

        content.push({
            table: {
                widths: ['*', '*', '*', '*'],
                body: skillsTable
            },
            margin: [0, 10, 0, 0],
            layout: 'noBorders'
        });
    }

    var eduSection = function() {
        if (education && education.length) {
            content.push(sectionHeading('education'));
        };

        $.each(education, function(i, edu) {
            if (edu['endDate']) {
                var status = 'Graduated: ';
                var date = edu['endDate'];
            } else {
                var status = 'Started: ';
                var date = edu['startDate'];
            }

            content.push({
                stack: [
                    { text: edu['eduInstitution'], style: 'project_heading', link: edu['eduUrl'] },
                    { text: edu['eduLevel'], italics: true },
                    { text: edu['eduName'] },
                    { text: [{ text: status, bold: true }, date] }
                ],
                margin: [0, 15, 0, 0]
            });
        });
    }

    // TODO(Scott): Each of these functions below should take content as an argument,
    // and the respective section's data.
    header();
    workExperienceSection();
    personProjectsSection();
    technicalCompetenciesSection();
    eduSection();

    return pdfMake.createPdf(docDefinition).download('resume.pdf');
  };

  $('[data-toggle=download-pdf]').on('click', function(e) {
    e.preventDefault();
    generateResume();
  });
});
