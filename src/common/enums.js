export const projectOptions = [
  {
    key: 'DEL',
    value: 'DEL',
    text: 'Delivery',
    icon: 'paper plane outline',
    color: 'orange',
  },
  {
    key: 'HAR',
    value: 'ANA',
    text: 'Analysis',
    icon: 'sliders horizontal',
    color: 'teal',
  },
  {key: 'RES', value: 'RES', text: 'Research', icon: 'flask', color: 'yellow'},
];

// Styling for different event types
export const eventType = {
  SF_CRE: {
    title: 'Study File Created',
    iconName: 'file',
    iconColor: 'green',
  },
  SF_UPD: {
    title: 'Study File Updated',
    iconName: 'file',
    iconColor: 'yellow',
  },
  SF_DEL: {
    title: 'Study File Deleted',
    iconName: 'file',
    iconColor: 'red',
  },
  FV_CRE: {
    title: 'File Version Created',
    iconName: 'file alternate',
    iconColor: 'green',
  },
  FV_UPD: {
    title: 'File Version Updated',
    iconName: 'file alternate',
    iconColor: 'yellow',
  },
  SD_CRE: {
    title: 'Study Created',
    iconName: 'lab',
    iconColor: 'green',
  },
  SD_UPD: {
    title: 'Study Updated',
    iconName: 'lab',
    iconColor: 'yellow',
  },
  PR_CRE: {
    title: 'Project Created',
    iconName: 'file code',
    iconColor: 'green',
  },
  PR_UPD: {
    title: 'Project Updated',
    iconName: 'file code',
    iconColor: 'yellow',
  },
  PR_DEL: {
    title: 'Project Deleted',
    iconName: 'file code',
    iconColor: 'red',
  },
  PR_LIN: {
    title: 'Project Linked',
    iconName: 'file code',
    iconColor: 'green',
  },
  PR_UNL: {
    title: 'Project Unlinked',
    iconName: 'file code',
    iconColor: 'red',
  },
  OTH: {
    title: 'Other',
    iconName: 'question',
    iconColor: 'grey',
  },
  PR_STR: {
    title: 'Project Creation Start',
    iconName: 'play',
    iconColor: 'blue',
  },
  PR_ERR: {
    title: 'Project Creation Error',
    iconName: 'x',
    iconColor: 'red',
  },
  PR_SUC: {
    title: 'Project Creation Success',
    iconName: 'checkmark',
    iconColor: 'green',
  },
  BK_STR: {
    title: 'Bucket Creation Start',
    iconName: 'play',
    iconColor: 'blue',
  },
  BK_ERR: {
    title: 'Bucket Creation Error',
    iconName: 'x',
    iconColor: 'red',
  },
  BK_SUC: {
    title: 'Bucket Creation Success',
    iconName: 'checkmark',
    iconColor: 'green',
  },
  CB_ADD: {
    title: 'Collaborator Added',
    iconName: 'user',
    iconColor: 'green',
  },
  CB_REM: {
    title: 'Collaborator Removed',
    iconName: 'user',
    iconColor: 'red',
  },
  BK_LIN: {
    title: 'Bucket Linked',
    iconName: 'trash',
    iconColor: 'green',
  },
  BK_UNL: {
    title: 'Bucket Unlinked',
    iconName: 'trash',
    iconColor: 'red',
  },
  IM_STR: {
    title: 'File Import Start',
    iconName: 'play',
    iconColor: 'blue',
  },
  IM_ERR: {
    title: 'File Import Error',
    iconName: 'x',
    iconColor: 'red',
  },
  IM_SUC: {
    title: 'File Import Success',
    iconName: 'checkmark',
    iconColor: 'green',
  },
  IN_UPD: {
    title: 'Ingestion Status Updated',
    iconName: 'hourglass half',
    iconColor: 'yellow',
  },
  PH_UPD: {
    title: 'Phenotype Status Updated',
    iconName: 'hourglass half',
    iconColor: 'yellow',
  },
  ST_UPD: {
    title: 'Sequencing Status Updated',
    iconName: 'hourglass half',
    iconColor: 'yellow',
  },
  RT_CRE: {
    title: 'Referral Token Created',
    iconName: 'mail outline',
    iconColor: 'yellow',
  },
  RT_CLA: {
    title: 'Referral Token Claimed',
    iconName: 'mail outline',
    iconColor: 'green',
  },
  SL_STR: {
    title: 'Slack Channel Creation Start',
    iconName: 'slack hash',
    iconColor: 'yellow',
  },
  SL_ERR: {
    title: 'Slack Channel Creation Error',
    iconName: 'slack hash',
    iconColor: 'red',
  },
  SL_SUC: {
    title: 'Slack Channel Creation Success',
    iconName: 'slack hash',
    iconColor: 'green',
  },
  DR_STA: {
    title: 'Data Review Started',
    iconName: 'clipboard check',
    iconColor: 'yellow',
  },
  DR_WAI: {
    title: 'Data Review Waiting for Updates',
    iconName: 'clipboard check',
    iconColor: 'orange',
  },
  DR_UPD: {
    title: 'Data Review Updated',
    iconName: 'clipboard check',
    iconColor: 'yellow',
  },
  DR_APP: {
    title: 'Data Review Approved',
    iconName: 'clipboard check',
    iconColor: 'green',
  },
  DR_CLO: {
    title: 'Data Review Closed',
    iconName: 'clipboard check',
    iconColor: 'black',
  },
  DR_REO: {
    title: 'Data Review Re-opened',
    iconName: 'clipboard check',
    iconColor: 'yellow',
  },
};

// Store file type title, description and icon
export const fileTypeDetail = {
  SHM: {
    icon: 'shipping',
    title: 'Biospecimen Manifest',
    requiredColumns: [],
    description:
      'Tabular files (e.g. CSV, TSV, Excel) containing biospecimen identifiers and metadata (e.g. tissue type, composition) provided to sequencing centers as well as consent type.',
    config: false,
  },
  CLN: {
    icon: 'hospital',
    title: 'Clinical/Phenotypic Data',
    requiredColumns: [],
    description:
      'Structured files with data linked to the biospecimen identifiers provided in the shipping manifest(s). Exports from data management applications, such as REDCap, are the fastest to process, but we will work with you on most formats.',
    config: false,
  },
  SEQ: {
    icon: 'dna',
    title: 'Sequencing Manifest',
    requiredColumns: [],
    description:
      'Tabular files (e.g. CSV, TSV, Excel) containing the biospecimen identifiers and the associated genomic data files. Typically provided by the sequencing center.',
    config: false,
  },
  DBG: {
    icon: 'file alternate',
    title: 'dbGaP Submission File',
    requiredColumns: [],
    description:
      'A document formatted to the dbGaP submission specification for uploading to dbGaP during a new release.',
    config: false,
  },
  OTH: {
    icon: 'question',
    title: 'Other',
    requiredColumns: [],
    description:
      'Any useful documents, such as study background information, data dictionaries, etc., that does not clearly fit in the other categories.',
    config: false,
  },
  S3S: {
    icon: 'aws',
    title: 'S3 Bucket Inventory',
    requiredColumns: ['Bucket', 'Key', 'ETag', 'Size'],
    description: 'Generated S3 bucket inventories.',
    config: true,
    url:
      'https://www.notion.so/d3b/Expedited-File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#82d12c1ba31847f1bf2c1bbc5c089b6a',
  },
  PDA: {
    icon: 'clipboard list',
    title: 'Participant Demographic and Administrative File',
    requiredColumns: [
      'Participant ID',
      'Consent Short Name',
      'Administrative Gender',
      'Ethnicity',
      'Age at Study Enrollment',
      'Age at Study Enrollment Units',
      'Deceased',
      'Age at Last Contact',
      'Age at Last Contact Units',
    ],
    description: 'Attributes for high-level data about participants in a study',
    config: true,
    url:
      'https://www.notion.so/d3b/Expedited-File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#d53b14317f004b6f9f9a8357ddc94f8f',
  },
  FTR: {
    icon: 'users',
    title: 'Family Trio',
    requiredColumns: [
      'Participant ID',
      'Mother Participant ID',
      'Father Participant ID',
    ],
    description: 'Relationships for simple, mother-father-participant families',
    config: true,
    url:
      'https://www.notion.so/d3b/Expedited-File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#c7292718da1243b29ff793a8d115a5c9',
  },
  GWO: {
    icon: 'dna',
    title: 'Genomic Workflow Output Manifest',
    requiredColumns: [
      'Cavatica ID',
      'Cavatica Task ID',
      'KF Biospecimen ID',
      'KF Participant ID',
      'KF Family ID',
      'Filepath',
      'Data Type',
      'Workflow Type',
      'Source Read',
    ],
    description: 'Metadata about files produced from Bix genomic workflows',
    config: true,
    url:
      'https://www.notion.so/d3b/Expedited-File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#d53b14317f004b6f9f9a8357ddc94f8f',
  },
};

// Store version state title and color
export const versionState = {
  PEN: {title: 'Pending review', labelColor: 'orange'},
  APP: {title: 'Approved', labelColor: 'teal'},
  CHN: {title: 'Changes needed', labelColor: 'red'},
  PRC: {title: 'Processed', labelColor: 'blue'},
  UPD: {title: 'Updated', labelColor: 'blue'},
};

// Store label colors for system version footer
export const systemEnvColors = {
  local: 'orange',
  dev: 'yellow',
  prd: 'green',
  qa: 'blue',
};

// Study creation status messages and icons
export const statusyMessage = {
  ERR: {
    icon: 'warning sign',
    text: 'Error(s) creating external study resources. Click for details.',
    class: 'text-red cursor-pointer noMargin',
  },
  SUC: {
    icon: 'check circle',
    text: 'External study resources created! Click for details.',
    class: 'text-green cursor-pointer noMargin',
  },
  STR: {
    icon: 'clock',
    text: 'External study resources creation in progress. Click for details.',
    class: 'text-blue cursor-pointer noMargin',
  },
};

// User roles
export const userRoleOptions = [
  {key: 'admin', value: 'admin', text: 'Admin'},
  {key: 'bix', value: 'bix', text: 'Bix'},
  {key: 'dev', value: 'dev', text: 'Dev'},
];

// default document tag options
export const defaultTagOptions = [
  {key: 'dbGaP', value: 'dbGaP', text: 'dbGaP'},
  {key: 'dCC', value: 'dCC', text: 'DCC'},
  {key: 'email', value: 'email', text: 'Email'},
  {key: 'dataDictionary', value: 'dataDictionary', text: 'Data Dictionary'},
];

// Icon name for different permissions
export const permissionIcon = {
  bucket: 'trash',
  collaborator: 'user',
  downloadtoken: 'setting',
  event: 'bars',
  file: 'file',
  group: 'user',
  job: 'tasks',
  permission: 'user',
  project: 'file code',
  queue: 'tasks',
  referraltoken: 'setting',
  settings: 'setting',
  status: 'hourglass half',
  study: 'lab',
  user: 'user',
  version: 'file alternate',
  volume: 'file archive',
  analysis: 'calculator',
  meta: 'sticky note',
  config: 'wrench',
  banner: 'bell',
  datareview: 'check',
  joblog: 'tasks',
  release: 'paper plane',
  releaseevent: 'calendar',
  releaseservice: 'paper plane',
  releasetask: 'clipboard check',
  ingestrun: 'search',
  validationrun: 'code',
  validationresultset: 'code'
};

// Icon color for different permissions
export const permissionColor = {
  view: 'blue',
  list: 'blue',
  link: 'green',
  unlink: 'red',
  add: 'green',
  remove: 'red',
  delete: 'red',
  change: 'yellow',
  sync: 'yellow',
  import: 'yellow',
  extract: 'green',
};

// Cavatica project workflow types 3 level dropdown options
export const workflowSelection = [
  {
    key: 'alignment',
    value: 'alignment',
    text: 'alignment',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [
      {key: 'tumor', value: 'tumor', text: 'tumor'},
      {key: 'germline', value: 'germline', text: 'germline'},
      {key: 'cellline', value: 'cellline', text: 'cellline'},
    ],
  },
  {
    key: 'gatk-hc-gvcf',
    value: 'gatk-hc-gvcf',
    text: 'gatk-hc-gvcf',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [{key: 'germline', value: 'germline', text: 'germline'}],
  },
  {
    key: 'family-joint-genotyping',
    value: 'family-joint-genotyping',
    text: 'family-joint-genotyping',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [{key: 'germline', value: 'germline', text: 'germline'}],
  },
  {
    key: 'cohort-joint-genotyping',
    value: 'cohort-joint-genotyping',
    text: 'cohort-joint-genotyping',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [{key: 'germline', value: 'germline', text: 'germline'}],
  },
  {
    key: 'single-vcf-genotyping',
    value: 'single-vcf-genotyping',
    text: 'single-vcf-genotyping',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [{key: 'germline', value: 'germline', text: 'germline'}],
  },
  {
    key: 'somatic-mutations',
    value: 'somatic-mutations',
    text: 'somatic-mutations',
    method: [
      {key: 'wgs', value: 'wgs', text: 'wgs'},
      {key: 'wxs', value: 'wxs', text: 'wxs'},
    ],
    sampleType: [
      {key: 'tumor', value: 'tumor', text: 'tumor'},

      {key: 'cellline', value: 'cellline', text: 'cellline'},
    ],
  },
  {
    key: 'rnaseq-analysis',
    value: 'rnaseq-analysis',
    text: 'rnaseq-analysis',
    method: [{key: 'bulkrna', value: 'bulkrna', text: 'bulkrna'}],
    sampleType: [{key: 'tumor', value: 'tumor', text: 'tumor'}],
  },
  {
    key: 'singlecell-rnaseq-anaysis',
    value: 'singlecell-rnaseq-anaysis',
    text: 'singlecell-rnaseq-anaysis',
    method: [{key: 'singlecell', value: 'singlecell', text: 'singlecell'}],
    sampleType: [{key: 'tumor', value: 'tumor', text: 'tumor'}],
  },
];

// MembershipRole types for collaborator roles within studies
export const collaboratorRoles = {
  INVESTIGATOR: {key: 'INVESTIGATOR', name: 'Investigator'},
  RESEARCHER: {key: 'RESEARCHER', name: 'Researcher'},
  ADMIN: {key: 'ADMIN', name: 'Administrative Staff'},
  ANALYST: {key: 'ANALYST', name: 'Data Analyst Staff'},
  COORDINATOR: {key: 'COORDINATOR', name: 'Coordinating Staff'},
  BIOINFO: {key: 'BIOINFO', name: 'Bioinformatics Staff'},
  DEVELOPER: {key: 'DEVELOPER', name: 'Developer'},
};

// File review status
export const reviewStatus = {
  not_started: {
    color: 'grey',
    icon: 'dot circle',
    text: 'Not Started',
    actions: ['close'],
  },
  in_review: {
    color: 'yellow',
    icon: 'play circle',
    text: 'In Review',
    actions: ['await', 'approve', 'close'],
  },
  awaiting_updates: {
    color: 'orange',
    icon: 'pause circle',
    text: 'Awaiting Updates',
    actions: ['close'],
  },
  completed: {
    color: 'green',
    icon: 'check circle',
    text: 'Completed',
    actions: [],
  },
  closed: {
    color: 'black',
    icon: 'stop circle',
    text: 'Closed',
    actions: ['reopen'],
  },
};
