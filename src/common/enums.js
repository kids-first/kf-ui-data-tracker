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
    key: 'gatk_genotypgvcf_vqsr',
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
    iconName: 'delete',
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
  OTH: {title: 'Other', iconName: 'question', iconColor: 'blue'},
};
