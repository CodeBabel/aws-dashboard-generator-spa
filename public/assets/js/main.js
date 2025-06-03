// src/data/templates/s3.json
var s3_default = {
  name: "Amazon S3",
  fields: [
    {
      label: "Bucket ARN",
      id: "bucket-arn",
      type: "text",
      placeholder: "arn:aws:s3:::my-bucket",
      required: true
    },
    {
      label: "Bucket Name",
      id: "bucket-name",
      type: "text",
      placeholder: "my-bucket",
      required: true
    }
  ],
  metricTemplate: {
    type: "metric",
    width: 12,
    height: 6,
    properties: {
      view: "timeSeries",
      metrics: [
        ["AWS/S3", "NumberOfObjects", "StorageType", "AllStorageTypes", "BucketName", "{bucket-arn}"],
        [".", "BucketSizeBytes", ".", "StandardStorage", ".", "."]
      ],
      region: "us-east-1",
      stat: "Average",
      period: 300
    }
  }
};

// src/data/templates/lambda.json
var lambda_default = {
  name: "AWS Lambda",
  fields: [
    {
      label: "Function Name",
      id: "function-name",
      type: "text",
      placeholder: "my-lambda-function",
      required: true
    }
  ],
  metricTemplate: {
    type: "metric",
    width: 12,
    height: 6,
    properties: {
      view: "timeSeries",
      metrics: [
        ["AWS/Lambda", "Invocations", "FunctionName", "{function-name}"],
        [".", "Errors", ".", "."],
        [".", "Duration", ".", "."],
        [".", "Throttles", ".", "."]
      ],
      region: "us-east-1",
      stat: "Average",
      period: 300
    }
  }
};

// src/data/templates/ec2.json
var ec2_default = {
  name: "Amazon EC2",
  fields: [
    {
      label: "Instance ID",
      id: "instance-id",
      type: "text",
      placeholder: "i-1234567890abcdef0",
      required: true
    },
    {
      label: "Region",
      id: "region",
      type: "text",
      placeholder: "us-east-1",
      required: true,
      default: "us-east-1"
    }
  ],
  metricTemplate: {
    type: "metric",
    width: 12,
    height: 6,
    properties: {
      view: "timeSeries",
      title: "EC2 Metrics - {instance-id}",
      metrics: [
        ["AWS/EC2", "CPUUtilization", "InstanceId", "{instance-id}"],
        [".", "NetworkIn", ".", "."],
        [".", "NetworkOut", ".", "."],
        [".", "DiskReadBytes", ".", "."],
        [".", "DiskWriteBytes", ".", "."],
        [".", "StatusCheckFailed", ".", "."]
      ],
      region: "{region}",
      stat: "Average",
      period: 300
    }
  }
};

// src/data/templates/alb.json
var alb_default = {
  name: "ALB",
  fields: [
    {
      label: "ALB ARN",
      id: "alb-arn",
      type: "text",
      placeholder: "app/testALB/12346566",
      required: true
    },
    {
      label: "Target Group ARN",
      id: "tg-arn",
      type: "text",
      placeholder: "targetgroup/http/445566",
      required: true
    },
    {
      label: "Region",
      id: "region",
      type: "text",
      placeholder: "us-east-1",
      required: true,
      default: "us-east-1"
    }
  ],
  metricTemplate: {
    widgets: [
      {
        type: "text",
        x: 0,
        y: 0,
        width: 18,
        height: 2,
        properties: {
          markdown: "# Application Load Balancer"
        }
      },
      {
        type: "metric",
        x: 0,
        y: 2,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "HTTPCode_ELB_5XX_Count", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          period: 60,
          stat: "Sum"
        }
      },
      {
        type: "metric",
        x: 9,
        y: 2,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          stat: "Sum",
          period: 60
        }
      },
      {
        type: "metric",
        x: 0,
        y: 8,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          stat: "Average",
          period: 60
        }
      },
      {
        type: "metric",
        x: 9,
        y: 8,
        width: 9,
        height: 6,
        properties: {
          view: "timeSeries",
          stacked: false,
          stat: "Sum",
          period: 60,
          metrics: [
            ["AWS/ApplicationELB", "ClientTLSNegotiationErrorCount", "LoadBalancer", "{alb-arn}"]
          ],
          region: "{region}"
        }
      },
      {
        type: "metric",
        x: 0,
        y: 14,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "HTTPCode_ELB_502_Count", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          period: 60,
          stat: "Sum"
        }
      },
      {
        type: "metric",
        x: 9,
        y: 14,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "HTTPCode_ELB_503_Count", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          period: 60,
          stat: "Sum"
        }
      },
      {
        type: "metric",
        x: 0,
        y: 20,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "HTTPCode_ELB_504_Count", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          period: 60,
          stat: "Sum"
        }
      },
      {
        type: "metric",
        x: 9,
        y: 20,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "HealthyHostCount", "TargetGroup", "{tg-arn}", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          stat: "Average",
          period: 60
        }
      },
      {
        type: "metric",
        x: 0,
        y: 26,
        width: 9,
        height: 6,
        properties: {
          metrics: [
            ["AWS/ApplicationELB", "UnHealthyHostCount", "TargetGroup", "{tg-arn}", "LoadBalancer", "{alb-arn}"]
          ],
          view: "timeSeries",
          stacked: false,
          region: "{region}",
          stat: "Average",
          period: 60
        }
      }
    ]
  }
};

// src/data/templates/index.js
var templates = { s3: s3_default, lambda: lambda_default, ec2: ec2_default, alb: alb_default };
function getTemplate(resourceType) {
  return templates[resourceType];
}
function getAllTemplates() {
  return templates;
}

// src/js/modules/resourceTemplates.js
var resourceTemplates = {
  getTemplate: function(resourceType) {
    return getTemplate(resourceType);
  },
  getAllTemplates: function() {
    return getAllTemplates();
  },
  generateWidget: function(resourceType, data) {
    const template = getTemplate(resourceType);
    if (!template) return null;
    const widget = JSON.parse(JSON.stringify(template.metricTemplate));
    const stringifiedWidget = JSON.stringify(widget);
    const replacedWidget = stringifiedWidget.replace(/\{(\w+-?\w+)\}/g, (match, fieldId) => {
      if (fieldId === "bucket-arn") {
        return data[fieldId]?.split(":").pop() || match;
      }
      return data[fieldId] || match;
    });
    return JSON.parse(replacedWidget);
  }
};

// src/js/modules/uiHandlers.js
var resourcesContainer = document.getElementById("resources-container");
var addResourceBtn = document.getElementById("add-resource");
var jsonOutput = document.getElementById("json-output");
var copyButton = document.getElementById("copy-button");
var dashboardNameInput = document.getElementById("dashboard-name");
function createResourceSelectionModal() {
  const modal = document.createElement("div");
  modal.className = "resource-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h3>Select Resource Type</h3>
            <div class="resource-options">
                ${Object.entries(resourceTemplates.getAllTemplates()).map(([key, resource]) => `
                    <button class="resource-option" data-resource-type="${key}">
                        ${resource.name}
                    </button>
                `).join("")}
            </div>
            <button class="close-modal">Cancel</button>
        </div>
    `;
  document.body.appendChild(modal);
  modal.querySelectorAll(".resource-option").forEach((option) => {
    option.addEventListener("click", () => {
      const resourceType = option.dataset.resourceType;
      addResource(resourceType);
      modal.remove();
    });
  });
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });
  return modal;
}
function addResource(resourceType) {
  const resourceId = Date.now();
  const template = resourceTemplates.getTemplate(resourceType);
  if (!template) {
    console.error(`Template not found for resource type: ${resourceType}`);
    return;
  }
  const resourceElement = document.createElement("div");
  resourceElement.className = "resource-form";
  resourceElement.dataset.resourceId = resourceId;
  resourceElement.dataset.resourceType = resourceType;
  let fieldsHtml = "";
  template.fields.forEach((field) => {
    fieldsHtml += `
            <div class="form-group">
                <label for="${field.id}-${resourceId}">${field.label}</label>
                <input type="${field.type}" id="${field.id}-${resourceId}" 
                       placeholder="${field.placeholder}" ${field.required ? "required" : ""}>
            </div>
        `;
  });
  resourceElement.innerHTML = `
        <div class="resource-form-header">
            <div class="resource-title">${template.name}</div>
            <button class="remove-resource" data-resource-id="${resourceId}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Remove
            </button>
        </div>
        ${fieldsHtml}
    `;
  resourcesContainer.appendChild(resourceElement);
  resourceElement.querySelector(".remove-resource").addEventListener("click", function() {
    resourcesContainer.removeChild(resourceElement);
    updateJsonOutput();
  });
  const inputs = resourceElement.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", updateJsonOutput);
  });
  updateJsonOutput();
}
function updateJsonOutput() {
  const dashboardName = dashboardNameInput.value || "MyDashboard";
  const resourceElements = document.querySelectorAll(".resource-form");
  const widgets = [];
  resourceElements.forEach((resourceElement) => {
    const resourceType = resourceElement.dataset.resourceType;
    const data = {};
    const template = resourceTemplates.getTemplate(resourceType);
    template.fields.forEach((field) => {
      const input = document.getElementById(`${field.id}-${resourceElement.dataset.resourceId}`);
      if (input) {
        data[field.id] = input.value;
      }
    });
    if (Object.values(data).every((val) => val)) {
      const widget = resourceTemplates.generateWidget(resourceType, data);
      if (widget) {
        widgets.push(widget);
      }
    }
  });
  const dashboardJson = {
    widgets
  };
  jsonOutput.textContent = JSON.stringify(dashboardJson, null, 2);
}
function initUIHandlers() {
  addResourceBtn.addEventListener("click", createResourceSelectionModal);
  dashboardNameInput.addEventListener("input", updateJsonOutput);
  copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Copied!
            `;
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2e3);
    });
  });
  addResource("s3");
}

// src/js/app.js
document.addEventListener("DOMContentLoaded", function() {
  initUIHandlers();
});
