// Debug - temp
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
    value: 'HAR',
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
  VR_STA: {
    title: 'Validation Run Started',
    iconName: 'code',
    iconColor: 'yellow',
  },
  VR_CAN: {
    title: 'Validation Run Canceled',
    iconName: 'code',
    iconColor: 'black',
  },
  VR_COM: {
    title: 'Validation Run Completed',
    iconName: 'code',
    iconColor: 'green',
  },
  VR_FAI: {
    title: 'Validation Run Failed',
    iconName: 'code',
    iconColor: 'red',
  },
  MB_ADD: {
    title: 'Organization Member Added',
    iconName: 'user',
    iconColor: 'green',
  },
  MB_REM: {
    title: 'Organization Member Removed',
    iconName: 'user',
    iconColor: 'red',
  },
  TV_CRE: {
    title: 'Template Version Created',
    iconName: 'file excel outline',
    iconColor: 'green',
  },
  TV_UPD: {
    title: 'Template Version Updated',
    iconName: 'file excel outline',
    iconColor: 'yellow',
  },
  TV_DEL: {
    title: 'Template Version Deleted',
    iconName: 'file excel outline',
    iconColor: 'red',
  },
  DT_CRE: {
    title: 'Data Template Created',
    iconName: 'file excel outline',
    iconColor: 'green',
  },
  DT_UPD: {
    title: 'Data Template Updated',
    iconName: 'file excel outline',
    iconColor: 'yellow',
  },
  DT_DEL: {
    title: 'Data Template Deleted',
    iconName: 'file excel outline',
    iconColor: 'red',
  },
  CB_UPD: {
    title: 'Collaborator Updated',
    iconName: 'user',
    iconColor: 'yellow',
  },
  IR_INI: {
    title: 'Ingest Run Initializing',
    iconName: 'computer',
    iconColor: 'yellow',
  },
  IR_STA: {
    title: 'Ingest Run Started',
    iconName: 'computer',
    iconColor: 'blue',
  },
  IR_CAN: {
    title: 'Ingest Run Canceled',
    iconName: 'computer',
    iconColor: 'grey',
  },
  IR_CLG: {
    title: 'Ingest Run Canceling',
    iconName: 'computer',
    iconColor: 'grey',
  },
  IR_COM: {
    title: 'Ingest Run Completed',
    iconName: 'computer',
    iconColor: 'green',
  },
  IR_FAI: {
    title: 'Ingest Run Failed',
    iconName: 'computer',
    iconColor: 'red',
  },
  OR_UPD: {
    title: 'Study Organization Updated',
    iconName: 'hospital outline',
    iconColor: 'yellow',
  },
  VR_CLG: {
    title: 'Validation Run Canceling',
    iconName: 'code',
    iconColor: 'black',
  },
  VR_INI: {
    title: 'Validation Run Initializing',
    iconName: 'code',
    iconColor: 'yellow',
  },
};

// Store file type title, description and icon
// export const fileTypeDetail = {
//   DBG: {
//     icon: 'file alternate',
//     title: 'dbGaP Submission File',
//     requiredColumns: [],
//     description:
//       'A document formatted to the dbGaP submission specification for uploading to dbGaP during a new release.',
//     config: false,
//     url: '',
//   },
//   OTH: {
//     icon: 'question',
//     title: 'Other',
//     requiredColumns: [],
//     description:
//       'Any useful documents, such as study background information, data dictionaries, etc., that does not clearly fit in the other categories.',
//     config: false,
//     url: '',
//   },
//   SEQ: {
//     icon: 'dna',
//     title: 'Sequencing File Manifest',
//     requiredColumns: [
//       'Aliquot ID',
//       'Sequencing Center',
//       'Sequencing Output Filepath',
//       'Reference Genome',
//       'Experiment Strategy',
//       'Sequencing Library Name',
//       'Sequencing Platform',
//       'Is Paired End',
//     ],
//     config: true,
//     description:
//       'Tabular file (e.g. CSV, TSV, Excel) containing the aliquot identifiers, associated sequencing experiment parameters, and the associated sequencing files. Typically provided by the sequencing center.',
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#3bafab3b51cc4388957a1825eadc3edf',
//   },
//   S3S: {
//     icon: 'aws',
//     title: 'S3 Scrapes',
//     requiredColumns: ['Bucket', 'Key', 'Size', 'ETag'],
//     description: 'Generated S3 bucket inventories.',
//     config: true,
//     url: '',
//   },
//   PDA: {
//     icon: 'clipboard list',
//     title: 'Participant Details',
//     requiredColumns: [
//       'Participant ID',
//       'Clinical Sex',
//       'Affected Status',
//       'Proband',
//     ],
//     description:
//       'Tabular files (e.g. CSV, TSV, Excel) containing demographic and administrative attributes for participants in the study',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#92aa778d272b498aac8b8d7181a93961',
//   },
//   PTD: {
//     icon: 'ambulance',
//     title: 'Participant Diseases',
//     requiredColumns: ['Participant ID', 'Condition Name', 'Category'],
//     description:
//       'Tabular files (e.g. CSV, TSV, Excel) containing attributes pertaining to the diagnosed diseases of participants in the study',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#e138e33e73b04acd8f07a06c7ac6c915',
//   },
//   PTP: {
//     icon: 'eye',
//     title: 'Participant Phenotypes',
//     requiredColumns: [
//       'Participant ID',
//       'Condition Name',
//       'Verification Status',
//     ],
//     description:
//       'Tabular files (e.g. CSV, TSV, Excel) containing attributes pertaining to the observed phenotypes of participants in the study.',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#67c654afe550494ebdf963a610fe42be',
//   },
//   FCM: {
//     icon: 'hubspot',
//     title: 'Complex Family',
//     requiredColumns: [
//       'First Participant ID',
//       'Second Participant ID',
//       'Relationship from First to Second',
//     ],
//     description:
//       'Tabular files (e.g. CSV, TSV, Excel) containing arbitrary family relationships captured as source <- relationship label -> target records',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#dfbd3ee6d4a242429eca5169baf829eb',
//   },
//   FTR: {
//     icon: 'users',
//     title: 'Family Trio',
//     requiredColumns: [
//       'Participant ID',
//       'Mother Participant ID',
//       'Father Participant ID',
//     ],
//     description:
//       'Tabular files (e.g. CSV, TSV, Excel) containing relationships for simple, mother-father-participant families',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#9279cf39600244aa97ee9580e4ba6703',
//   },
//   GWO: {
//     icon: 'dna',
//     title: 'Genomic Workflow Output Manifest',
//     requiredColumns: [
//       'Cavatica ID',
//       'Cavatica Task ID',
//       'KF Biospecimen ID',
//       'KF Participant ID',
//       'KF Family ID',
//       'Filepath',
//       'Data Type',
//       'Workflow Type',
//       'Source Read',
//     ],
//     description:
//       'Metadata about harmonized files produced from Bix genomic workflows',
//     config: true,
//     url: '',
//   },
//   GOB: {
//     title: 'General Observations',
//     icon: 'file',
//     description:
//       'This file is a catch-all for any attributes about a participant that cannot adequately be captured in any of the other file types. The fields here are based on the FHIR Observation resource which is defined as "simple name/value pair assertions with some metadata, but some observations group other observations together logically, or even are multi-component observations". Observations can include vital signs, laboratory data, environment exposure, survey data and/or other clinical assessments. The DRC team can help advise on how best to represent your data as observations when needed.',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#d8c74679eb9d4a768a6bcb6f8da8508b',
//     requiredColumns: [
//       'Participant ID',
//       'Observation Name',
//       'Category',
//       'Status',
//     ],
//   },
//   ALM: {
//     title: 'Aliquot Manifest',
//     icon: 'file',
//     description:
//       'The fields in this file may seem like they could/should be part of one of the other specimen templates. The reason why this information is in its own template is because sometimes it is produced by the research PI and other times it is produced by the sequencing center. In the former case, the research PI (or an associated lab) has taken ownership over portioning the specimens into aliquots and creating the inventory of specimens, aliquots, and analyte types before they are sent for sequencing. In the latter case, the sequencing center may spin out the analyte types to create the aliquots, in which case it becomes the single source of truth for specimens and aliquots.',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#5e475db644224dd2a60ddf1fdd1bbc8e',
//     requiredColumns: [
//       'Specimen ID',
//       'Aliquot ID',
//       'Analyte Type',
//       'Sequencing Center',
//     ],
//   },
//   BBM: {
//     title: 'Biobank Manifest',
//     icon: 'file',
//     description:
//       'This file is expected to be supplied by a Biobank and contains information about the storage state of the specimen and/or its aliquots (if they exist) in the Biobank. The information in this file will be useful when it is indexed and used in searching for available specimens for sequencing.',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#bb75197ca7494e99b552b725094ceb45',
//     requiredColumns: ['Specimen ID', 'Aliquot ID', 'Analyte Type'],
//   },
//   BCM: {
//     title: 'Biospecimen Collection Manifest',
//     icon: 'file',
//     description:
//       'This file is expected to be supplied by the research PI and contains the most common and critical information about the collection of the specimen such as its basic biological characteristics (e.g. composition, anatomical site), consenting information, and (if applicable) specimen grouping information (not to be confused with aliquots). ',
//     config: true,
//     url:
//       'https://www.notion.so/d3b/File-Types-and-Guidelines-fc5bd4390fa54de5a70b550d73779de9#85139587c7f44a1badf520ecc10d0445',
//     requiredColumns: [
//       'Participant ID',
//       'Specimen ID',
//       'Composition Name',
//       'Body Site Name',
//     ],
//   },
// };

// General file type with no required columns
export const fileTypeDetail = {
  DBG: {
    icon: 'file alternate',
    title: 'dbGaP Submission File',
    requiredColumns: [],
    description:
      'A document formatted to the dbGaP submission specification for uploading to dbGaP during a new release.',
    config: false,
    url: '',
  },
  OTH: {
    icon: 'question',
    title: 'Other',
    requiredColumns: [],
    description:
      'Any useful documents, such as study background information, data dictionaries, etc., that does not clearly fit in the other categories.',
    config: false,
    url: '',
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
  validationresultset: 'code',
  datatemplate: 'file excel',
  organization: 'group',
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

// Icon options for data template
export const dataTemplateIcons = [
  'address book',
  'address card',
  'ambulance',
  'archive',
  'balance scale',
  'band aid',
  'barcode',
  'bath',
  'bell',
  'birthday cake',
  'blind',
  'book',
  'bookmark',
  'briefcase',
  'bug',
  'building',
  'bullhorn',
  'bullseye',
  'calculator',
  'calendar',
  'calendar alternate',
  'certificate',
  'chart area',
  'chart bar',
  'chart line',
  'chart pie',
  'check',
  'circle',
  'clipboard',
  'clone',
  'cloud',
  'code',
  'code branch',
  'coffee',
  'columns',
  'comment',
  'compass',
  'copy',
  'copyright',
  'cut',
  'dna',
  'edit',
  'envelope',
  'envelope open',
  'envelope square',
  'eraser',
  'eye',
  'fax',
  'file',
  'file outline',
  'file alternate',
  'file archive',
  'file audio',
  'file code',
  'file excel',
  'file image',
  'file pdf',
  'file powerpoint',
  'file video',
  'file word',
  'fire extinguisher',
  'first aid',
  'flag',
  'folder',
  'folder open',
  'globe',
  'h square',
  'heart',
  'heartbeat',
  'hospital',
  'hospital symbol',
  'hourglass',
  'industry',
  'keyboard',
  'map marker',
  'medkit',
  'microchip',
  'paper plane',
  'paperclip',
  'paste',
  'pen square',
  'pencil alternate',
  'percent',
  'phone',
  'phone square',
  'phone volume',
  'pills',
  'play',
  'plus',
  'plus square',
  'qrcode',
  'recycle',
  'registered',
  'save',
  'shield alternate',
  'sign language',
  'sitemap',
  'smile',
  'square',
  'star',
  'stethoscope',
  'sticky note',
  'stop',
  'suitcase',
  'syringe',
  'table',
  'tag',
  'tags',
  'tasks',
  'terminal',
  'th',
  'th list',
  'thermometer',
  'thumbs up',
  'thumbtack',
  'user',
  'user md',
  'user secret',
  'weight',
  'wheelchair',
];
