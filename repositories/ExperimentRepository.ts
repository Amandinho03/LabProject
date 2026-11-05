import { experiments, DBExperiment } from "../dummyDB.js";

export interface IExperimentRepository {
  getAll(): Promise<DBExperiment[]>;
  getById(id: number | string): Promise<DBExperiment | undefined>;
  create(experimentData: Omit<DBExperiment, "id">): Promise<DBExperiment>;
  update(
    id: number | string,
    updatedData: Partial<DBExperiment>,
  ): Promise<DBExperiment | undefined>;
  delete(id: number | string): Promise<boolean>;
}

// in-memory implementation
export class InMemoryExperimentRepository implements IExperimentRepository {
  async getAll(): Promise<DBExperiment[]> {
    return experiments;
  }

  async getById(id: number | string): Promise<DBExperiment | undefined> {
    const numericId = Number(id);
    return experiments.find((e) => e.id === numericId);
  }

  async create(
    experimentData: Omit<DBExperiment, "id">,
  ): Promise<DBExperiment> {
    const newId =
      experiments.length > 0
        ? Math.max(...experiments.map((exp) => exp.id)) + 1
        : 1;

    const newRecord: DBExperiment = { id: newId, ...experimentData };
    experiments.push(newRecord);
    return newRecord;
  }

  async update(
    id: number | string,
    updatedData: Partial<DBExperiment>,
  ): Promise<DBExperiment | undefined> {
    const exp = await this.getById(id);
    if (!exp) return undefined;
    Object.assign(exp, updatedData);
    return exp;
  }

  async delete(id: number | string): Promise<boolean> {
    const numericId = Number(id);
    const index = experiments.findIndex((e) => e.id === numericId);
    if (index === -1) return false;
    experiments.splice(index, 1);
    return true;
  }
}
