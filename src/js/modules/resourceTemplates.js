export const resourceTemplates = {
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
            const bucketName = data['bucket-arn'].split(':').pop();
            return {
                type: "metric",
                width: 12,
                height: 6,
                properties: {
                    view: "timeSeries",
                    title: `S3 Metrics - ${bucketName}`,
                    metrics: [
                        [ "AWS/S3", "NumberOfObjects", "StorageType", "AllStorageTypes", "BucketName", bucketName ],
                        [ ".", "BucketSizeBytes", ".", "StandardStorage", ".", "." ]
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
                    title: `Lambda Metrics - ${data['function-name']}`,
                    metrics: [
                        [ "AWS/Lambda", "Invocations", "FunctionName", data['function-name'] ],
                        [ ".", "Errors", ".", "." ],
                        [ ".", "Duration", ".", "." ],
                        [ ".", "Throttles", ".", "." ]
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
                    title: `EC2 Metrics - ${data['instance-id']}`,
                    metrics: [
                        [ "AWS/EC2", "CPUUtilization", "InstanceId", data['instance-id'] ],
                        [ ".", "NetworkIn", ".", "." ],
                        [ ".", "NetworkOut", ".", "." ],
                        [ ".", "DiskReadBytes", ".", "." ],
                        [ ".", "DiskWriteBytes", ".", "." ]
                    ],
                    region: "us-east-1",
                    stat: "Average",
                    period: 300
                }
            };
        }
    }
};

// Function to add new resource templates dynamically
export function addResourceTemplate(name, template) {
    if (!resourceTemplates[name]) {
        resourceTemplates[name] = template;
        return true;
    }
    return false;
}