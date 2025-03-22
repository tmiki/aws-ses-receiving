# AWS SES Email Receiving CDK Project

This project implements AWS CDK stacks for:

1. Creating a Route53 Hosted Zone
2. Configuring Amazon SES domain identity
3. Creating a series of AWS resources receiving emails.
   1. Setting up SES email receiving rules
   2. Storing received emails in an S3 bucket

## Project Structure

```
ses-receiving/
├── bin/                       # CDK app entry point
│   └── ses-receiving.ts       # Main CDK app file
├── envconfig/                 # Environment-specific configurations
│   ├── env-dev.ts             # Development environment config
│   ├── env-prd.ts             # Production environment config
│   ├── env-test.ts            # Test environment config
│   └── types.ts               # Config type definitions
├── lib/                       # Main code
│   ├── patterns/              # Reusable infrastructure patterns
│   │   ├── route53-hosted-zone.ts  # Route53 hosted zone pattern
│   │   ├── s3bucket-baseline.ts    # S3 bucket pattern
│   │   └── ses-email-receiving.ts  # SES email receiving pattern
│   └── stacks/                # CDK stacks
│       ├── route53-hosted-zone-stack.ts  # Stack for Route53 Hosted Zone
│       ├── ses-identity-stack.ts         # Stack for SES Identity
│       └── ses-email-receiving-stack.ts  # Stack for SES Email Receiving
└── utils/                     # Utility functions
    ├── cdk-util.ts            # CDK utilities
    ├── debug-out-util.ts      # Debug output utilities
    ├── lookup-util.ts         # Resource lookup utilities
    ├── naming-util.ts         # Resource naming utilities
    ├── project-environment.ts # Project environment utilities
    └── resource-name-string.ts # Resource name string utilities
```

## Environment Configuration

The project uses environment-specific configurations defined in the `envconfig` directory. The environment is determined by the `ENV_NAME` environment variable.

### Available Environments

- `dev`: Development environment
- `prd`: Production environment
- `test`: Test environment (for unit tests)

### Configuration Structure

Each environment configuration includes:

- Domain Configuration
- SES Email Receiving Configuration

## Utility Classes

The project includes several utility classes to help with resource naming, environment configuration, and more:

- **CdkUtil**: Main utility class that provides access to other utilities
- **ProjectEnvironment**: Manages environment variables and project settings
- **NamingUtil**: Generates consistent resource names
- **ResourceNameString**: Provides resource names in different case styles (Pascal, Snake, Kebab)
- **LookupUtil**: Helps with looking up existing resources
- **DebugOutUtil**: Assists with debugging output

## Prerequisites

- Node.js and npm installed
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.envrc` file based on `.envrc.example`:
   ```
   export AWS_PROFILE=yourprofile
   export ENV_NAME=dev
   export PJ_CODE_NAME=emailrecv
   export CDK_DEFAULT_ACCOUNT=123456789012
   export CDK_DEFAULT_REGION=us-west-2
   ```

## Deployment

1. Bootstrap your AWS environment (if not already done):

   ```
   . .envrc
   npx cdk bootstrap aws://${CDK_DEFAULT_ACCOUNT}/${CDK_DEFAULT_REGION}
   ```

2. Deploy the stacks:

   ```
   npx cdk deploy --all
   ```

   Or deploy individual stacks:

   ```
   npx cdk deploy emailrecv-dev-route53-hosted-zone
   npx cdk deploy emailrecv-dev-ses-identity
   npx cdk deploy emailrecv-dev-ses-email-receiving
   ```

3. After deployment:
   - Note the nameservers from the CloudFormation outputs and configure them in your domain registrar
   - Verify the SES domain identity in the AWS SES console
   - Set the active receipt rule set in the SES console

## Testing

Send an email to any address at your configured email domain (e.g., `test@mail.example.com`) and check the S3 bucket to confirm the email was stored.

## Useful Commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
