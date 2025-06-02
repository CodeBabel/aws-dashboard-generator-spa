// src/js/modules/resourceTemplates.js
var resourceTemplates = {
  s3: {
    name: "Amazon S3",
    fields: [
      {
        label: "Bucket ARN",
        id: "bucket-arn",
        type: "text",
        placeholder: "arn:aws:s3:::my-bucket",
        required: true
      }
    ],
    generateWidget: function(data) {
      const bucketName = data["bucket-arn"].split(":").pop();
      return {
        type: "metric",
        width: 12,
        height: 6,
        properties: {
          view: "timeSeries",
          title: `S3 Metrics - ${bucketName}`,
          metrics: [
            ["AWS/S3", "NumberOfObjects", "StorageType", "AllStorageTypes", "BucketName", bucketName],
            [".", "BucketSizeBytes", ".", "StandardStorage", ".", "."]
          ],
          region: "us-east-1",
          stat: "Average",
          period: 300
        }
      };
    }
  },
  lambda: {
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
    generateWidget: function(data) {
      return {
        type: "metric",
        width: 12,
        height: 6,
        properties: {
          view: "timeSeries",
          title: `Lambda Metrics - ${data["function-name"]}`,
          metrics: [
            ["AWS/Lambda", "Invocations", "FunctionName", data["function-name"]],
            [".", "Errors", ".", "."],
            [".", "Duration", ".", "."],
            [".", "Throttles", ".", "."]
          ],
          region: "us-east-1",
          stat: "Average",
          period: 300
        }
      };
    }
  },
  ec2: {
    name: "Amazon EC2",
    fields: [
      {
        label: "Instance ID",
        id: "instance-id",
        type: "text",
        placeholder: "i-1234567890abcdef0",
        required: true
      }
    ],
    generateWidget: function(data) {
      return {
        type: "metric",
        width: 12,
        height: 6,
        properties: {
          view: "timeSeries",
          title: `EC2 Metrics - ${data["instance-id"]}`,
          metrics: [
            ["AWS/EC2", "CPUUtilization", "InstanceId", data["instance-id"]],
            [".", "NetworkIn", ".", "."],
            [".", "NetworkOut", ".", "."],
            [".", "DiskReadBytes", ".", "."],
            [".", "DiskWriteBytes", ".", "."]
          ],
          region: "us-east-1",
          stat: "Average",
          period: 300
        }
      };
    }
  }
};

// src/js/modules/dashboardGenerator.js
function generateDashboardJson(dashboardName, resourceElements) {
  const widgets = [];
  resourceElements.forEach((resourceElement) => {
    const resourceType = resourceElement.dataset.resourceType;
    const template = resourceTemplates[resourceType];
    const data = {};
    template.fields.forEach((field) => {
      const input = document.getElementById(`${field.id}-${resourceElement.dataset.resourceId}`);
      if (input) {
        data[field.id] = input.value;
      }
    });
    if (Object.values(data).every((val) => val)) {
      widgets.push(template.generateWidget(data));
    }
  });
  return {
    widgets
  };
}

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
                ${Object.entries(resourceTemplates).map(([key, resource]) => `
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
  const template = resourceTemplates[resourceType];
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
  const dashboardJson = generateDashboardJson(dashboardName, resourceElements);
  jsonOutput.textContent = JSON.stringify(dashboardJson, null, 2);
}
function initUIHandlers() {
  addResourceBtn.addEventListener("click", function() {
    addResourceBtn.addEventListener("click", createResourceSelectionModal);
  });
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
