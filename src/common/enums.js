export const projectOptions = [
  {key: 'DEL', value: 'DEL', text: 'Delivery', icon: 'paper plane outline'},
  {key: 'HAR', value: 'HAR', text: 'Analysis', icon: 'sliders horizontal'},
  {key: 'RES', value: 'RES', text: 'Research', icon: 'flask'},
];

// Different kinds of workflows Cavatica projects
export const workflowOptions = [
  {key: 'bwa_mem', value: 'bwa_mem', text: 'bwa_mem'},
  {key: 'bwa_mem_bqsr', value: 'bwa_mem_bqsr', text: 'bwa_mem_bqsr'},
  {key: 'star_2_pass', value: 'star_2_pass', text: 'star_2_pass'},
  {
    key: 'gatk_haplotypecaller',
    value: 'gatk_haplotypecaller',
    text: 'GATK Haplotypecaller',
  },
  {
    key: 'gatk_genotypgvcf',
    value: 'gatk_genotypgvcf',
    text: 'GATK Genotypgvcf',
  },
  {
    key: 'gatk_genotypegvcf_vqsr',
    value: 'gatk_genotypegvcf_vqsr',
    text: 'GATK GenotypeGVCF VQSR',
  },
  {
    key: 'strelka2_somatic_mode',
    value: 'strelka2_somatic_mode',
    text: 'Strelka2 Somatic Mode',
  },
  {
    key: 'mutect2_somatic_mode',
    value: 'mutect2_somatic_mode',
    text: 'MuTect2 Somatic Mode',
  },
  {
    key: 'mutect2_tumor_only_mode',
    value: 'mutect2_tumor_only_mode',
    text: 'MuTect2 Tumor Only Mode',
  },
  {
    key: 'vardict_single_sample_mode',
    value: 'vardict_single_sample_mode',
    text: 'VarDict Single Sample Mode',
  },
  {
    key: 'vardict_paired_sample_mode',
    value: 'vardict_paired_sample_mode',
    text: 'VarDict Paired Sample Mode',
  },
  {
    key: 'control_freec_somatic_mode',
    value: 'control_freec_somatic_mode',
    text: 'Control FREEC Somatic Mode',
  },
  {
    key: 'control_freec_germline_mode',
    value: 'control_freec_germline_mode',
    text: 'Control FREEC Germline Mode',
  },
  {
    key: 'stringtie_expression',
    value: 'stringtie_expression',
    text: 'StringTie Expression',
  },
  {key: 'manta_somatic', value: 'manta_somatic', text: 'Manta Somatic'},
  {key: 'manta_germline', value: 'manta_germline', text: 'Manta Germline'},
  {key: 'lumpy_somatic', value: 'lumpy_somatic', text: 'LUMPY Somatic'},
  {key: 'lumpy_germline', value: 'lumpy_germline', text: 'LUMPY Germline'},
  {key: 'rsem', value: 'rsem', text: 'RSEM'},
  {key: 'kallisto', value: 'kallisto', text: 'Kallisto'},
  {key: 'star_fusion', value: 'star_fusion', text: 'Star Fusion'},
  {key: 'arriba', value: 'arriba', text: 'Arriba'},
  {key: 'peddy', value: 'peddy', text: 'peddy'},
];

// Styling for different event types
export const eventType = {
  SF_CRE: {
    title: 'Study File Created',
    iconName: 'add',
    iconColor: 'green',
  },
  SF_UPD: {
    title: 'Study File Updated',
    iconName: 'refresh',
    iconColor: 'yellow',
  },
  SF_DEL: {
    title: 'Study File Deleted',
    iconName: 'trash',
    iconColor: 'red',
  },
  FV_CRE: {
    title: 'File Version Created',
    iconName: 'add',
    iconColor: 'green',
  },
  FV_UPD: {
    title: 'File Version Updated',
    iconName: 'refresh',
    iconColor: 'yellow',
  },
  SD_CRE: {title: 'Study Created', iconName: 'add', iconColor: 'green'},
  SD_UPD: {
    title: 'Study Updated',
    iconName: 'refresh',
    iconColor: 'yellow',
  },
  PR_CRE: {
    title: 'Project Created',
    iconName: 'add',
    iconColor: 'green',
  },
  PR_UPD: {
    title: 'Project Updated',
    iconName: 'refresh',
    iconColor: 'yellow',
  },
  PR_DEL: {
    title: 'Project Deleted',
    iconName: 'trash',
    iconColor: 'red',
  },
  PR_LIN: {
    title: 'Project Linked',
    iconName: 'linkify',
    iconColor: 'green',
  },
  PR_UNL: {
    title: 'Project Unlinked',
    iconName: 'unlinkify',
    iconColor: 'red',
  },
  OTH: {title: 'Other', iconName: 'question', iconColor: 'grey'},
  PR_STR: {
    title: 'Project Creation Start',
    iconName: 'play',
    iconColor: 'blue',
  },
  PR_ERR: {title: 'Project Creation Error', iconName: 'x', iconColor: 'red'},
  PR_SUC: {
    title: 'Project Creation Success',
    iconName: 'checkmark',
    iconColor: 'blue',
  },
  BK_STR: {
    title: 'Bucket Creation Start',
    iconName: 'play',
    iconColor: 'blue',
  },
  BK_ERR: {title: 'Bucket Creation Error', iconName: 'x', iconColor: 'red'},
  BK_SUC: {
    title: 'Bucket Creation Success',
    iconName: 'checkmark',
    iconColor: 'blue',
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
};

// Store file type title, description and icon
export const fileTypeDetail = {
  SHM: {
    icon: 'shipping',
    title: 'Biospecimen Manifest',
    description:
      'Tabular files (e.g. CSV, TSV, Excel) containing biospecimen identifiers and metadata (e.g. tissue type, composition) provided to sequencing centers as well as consent type.',
  },
  CLN: {
    icon: 'hospital',
    title: 'Clinical/Phenotypic Data',
    description:
      'Structured files with data linked to the biospecimen identifiers provided in the shipping manifest(s). Exports from data management applications, such as REDCap, are the fastest to process, but we will work with you on most formats.',
  },
  SEQ: {
    icon: 'dna',
    title: 'Sequencing Manifest',
    description:
      'Tabular files (e.g. CSV, TSV, Excel) containing the biospecimen identifiers and the associated genomic data files. Typically provided by the sequencing center.',
  },
  DBG: {
    icon: 'file alternate',
    title: 'dbGaP Submission File',
    description:
      'A document formatted to the dbGaP submission specification for uploading to dbGaP during a new release.',
  },
  OTH: {
    icon: 'question',
    title: 'Other',
    description:
      'Any useful documents, such as study background information, data dictionaries, etc., that does not clearly fit in the other categories.',
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
