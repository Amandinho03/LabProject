import { DBExperiment } from "../dummyDB.js";
import { AppError } from "../utils/AppError.js";

// strategy
export interface IProposalExporter {
  readonly contentType: string;
  readonly extension: string;
  export(experiments: DBExperiment[]): string;
}

// CSV exporter
export class CsvProposalExporter implements IProposalExporter {
  readonly contentType = "text/csv";
  readonly extension = "csv";

  export(experiments: DBExperiment[]): string {
    const headers = ["ID", "Scientist", "Machine", "Status"];
    const rows = experiments.map((exp) =>
      [
        exp.id,
        `"${String(exp.scientist).replace(/"/g, '""')}"`,
        `"${String(exp.machine).replace(/"/g, '""')}"`,
        `"${String(exp.status).replace(/"/g, '""')}"`,
      ].join(","),
    );
    return [headers.join(","), ...rows].join("\n");
  }
}

// JSON exporter
export class JsonProposalExporter implements IProposalExporter {
  readonly contentType = "application/json";
  readonly extension = "json";

  export(experiments: DBExperiment[]): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalProposals: experiments.length,
        proposals: experiments,
      },
      null,
      2,
    );
  }
}

// factory
export class ExporterFactory {
  private static readonly strategies: Record<string, IProposalExporter> = {
    csv: new CsvProposalExporter(),
    json: new JsonProposalExporter(),
  };

  static getExporter(format: string): IProposalExporter {
    const key = format.toLowerCase();
    const exporter = this.strategies[key];
    if (!exporter) {
      throw new AppError(
        `Unsupported export format "${format}". Supported formats: ${Object.keys(this.strategies).join(", ")}`,
        400,
      );
    }
    return exporter;
  }
}