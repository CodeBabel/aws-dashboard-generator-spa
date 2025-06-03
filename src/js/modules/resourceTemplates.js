import { getTemplate, getAllTemplates, addTemplate } from '../../data/templates/index.js';

const resourceTemplates = {
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
        
        // Process all replacements in the entire widget object
        const stringifiedWidget = JSON.stringify(widget);
        const replacedWidget = stringifiedWidget.replace(/\{(\w+-?\w+)\}/g, (match, fieldId) => {
            // Handle special field transformations
            if (fieldId === 'bucket-arn') {
                return data[fieldId]?.split(':').pop() || match; // Extract bucket name from ARN
            }
            return data[fieldId] || match; // Return original if not found
        });
        
        return JSON.parse(replacedWidget);
    }
};

export { resourceTemplates };