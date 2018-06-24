export class ReportQuestion {
    questions: { [key: string]: QuestionMetadata };
    created_uid: string;
    gameId: string;
}


export class QuestionMetadata {
    reason: string;
}

