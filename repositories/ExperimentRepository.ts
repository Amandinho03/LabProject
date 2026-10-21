import { experiments, DBExperiment } from "../dummyDB.js";

export class ExperimentRepository {
  static async getAll(): Promise<DBExperiment[]> {
    return Promise.resolve(experiments);
  }

  static async getById(id: number | string): Promise<DBExperiment | undefined> {
    const numericId = Number(id);
    const exp = experiments.find((e) => e.id === numericId);
    return Promise.resolve(exp);
  }

  static async findIndex(id: number | string): Promise<number> {
    const numericId = Number(id);
    const index = experiments.findIndex((e) => e.id === numericId);
    return Promise.resolve(index);
  }

  static async create(experimentData: Omit<DBExperiment, "id">): Promise<DBExperiment> {
    const newId = experiments.length > 0
        ? Math.max(...experiments.map((exp) => exp.id)) + 1
        : 1;

    const newRecord: DBExperiment = { id: newId, ...experimentData };
    experiments.push(newRecord);
    
    return Promise.resolve(newRecord);
  }

  static async update(
    id: number | string,
    updatedData: Partial<DBExperiment>,
  ): Promise<DBExperiment | undefined> {
    const exp = await this.getById(id);
    if (!exp) return undefined;
    Object.assign(exp, updatedData);
    return Promise.resolve(exp);
  }

  static async delete(index: number): Promise<void> {
    experiments.splice(index, 1);
    return Promise.resolve();
  }

  
}