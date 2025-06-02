import { resourceTemplates } from './resourceTemplates.js';
import { generateDashboardJson } from './dashboardGenerator.js';

// DOM elements
const resourcesContainer = document.getElementById('resources-container');
const addResourceBtn = document.getElementById('add-resource');
const jsonOutput = document.getElementById('json-output');
const copyButton = document.getElementById('copy-button');
const dashboardNameInput = document.getElementById('dashboard-name');


// Add this function to create resource selection modal
function createResourceSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'resource-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Select Resource Type</h3>
            <div class="resource-options">
                ${Object.entries(resourceTemplates).map(([key, resource]) => `
                    <button class="resource-option" data-resource-type="${key}">
                        ${resource.name}
                    </button>
                `).join('')}
            </div>
            <button class="close-modal">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelectorAll('.resource-option').forEach(option => {
        option.addEventListener('click', () => {
            const resourceType = option.dataset.resourceType;
            addResource(resourceType);
            modal.remove();
        });
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    return modal;
}

// Add resource to the form
export function addResource(resourceType) {
    const resourceId = Date.now();
    const template = resourceTemplates[resourceType];
    
    const resourceElement = document.createElement('div');
    resourceElement.className = 'resource-form';
    resourceElement.dataset.resourceId = resourceId;
    resourceElement.dataset.resourceType = resourceType;
    
    let fieldsHtml = '';
    template.fields.forEach(field => {
        fieldsHtml += `
            <div class="form-group">
                <label for="${field.id}-${resourceId}">${field.label}</label>
                <input type="${field.type}" id="${field.id}-${resourceId}" 
                       placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
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
    
    // Add event listener to remove button
    resourceElement.querySelector('.remove-resource').addEventListener('click', function() {
        resourcesContainer.removeChild(resourceElement);
        updateJsonOutput();
    });
    
    // Add event listeners to all inputs for this resource
    const inputs = resourceElement.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateJsonOutput);
    });
    
    updateJsonOutput();
}

// Update JSON output
export function updateJsonOutput() {
    const dashboardName = dashboardNameInput.value || 'MyDashboard';
    const resourceElements = document.querySelectorAll('.resource-form');
    const dashboardJson = generateDashboardJson(dashboardName, resourceElements);
    jsonOutput.textContent = JSON.stringify(dashboardJson, null, 2);
}

// Initialize UI event handlers
export function initUIHandlers() {
    // Add resource button click handler
    addResourceBtn.addEventListener('click', function() {
        // For now, default to adding S3 resource
        // In a more complete implementation, you'd show a modal to select resource type
        // addResource('s3');
        addResourceBtn.addEventListener('click', createResourceSelectionModal);
    });

    // Dashboard name input change handler
    dashboardNameInput.addEventListener('input', updateJsonOutput);

    // Copy to clipboard
    copyButton.addEventListener('click', function() {
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
            }, 2000);
        });
    });

    // Initialize with one S3 resource
    addResource('s3');
}