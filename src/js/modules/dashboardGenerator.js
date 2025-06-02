import { resourceTemplates } from './resourceTemplates.js';

export function generateDashboardJson(dashboardName, resourceElements) {
    const widgets = [];
    
    resourceElements.forEach(resourceElement => {
        const resourceType = resourceElement.dataset.resourceType;
        const template = resourceTemplates[resourceType];
        
        const data = {};
        template.fields.forEach(field => {
            const input = document.getElementById(`${field.id}-${resourceElement.dataset.resourceId}`);
            if (input) {
                data[field.id] = input.value;
            }
        });
        
        if (Object.values(data).every(val => val)) {
            widgets.push(template.generateWidget(data));
        }
    });
    
    return {
        widgets: widgets
    };
}