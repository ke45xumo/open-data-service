import JobResult from './job/jobResult';

/**
 * Event send by the Transformation service upon transformation finish
 */
export interface TransformationEvent {
    pipelineId: number      // ID of the pipeline
    pipelineName: string    // Name of the pipeline

    dataLocation: string    // url (location) of the data

    jobResult: JobResult    // result of the transformation

}