import axios from 'axios';
import queryString from 'query-string';
import {
  PerformanceEvaluationInterface,
  PerformanceEvaluationGetQueryInterface,
} from 'interfaces/performance-evaluation';
import { GetQueryInterface } from '../../interfaces';

export const getPerformanceEvaluations = async (query?: PerformanceEvaluationGetQueryInterface) => {
  const response = await axios.get(`/api/performance-evaluations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPerformanceEvaluation = async (performanceEvaluation: PerformanceEvaluationInterface) => {
  const response = await axios.post('/api/performance-evaluations', performanceEvaluation);
  return response.data;
};

export const updatePerformanceEvaluationById = async (
  id: string,
  performanceEvaluation: PerformanceEvaluationInterface,
) => {
  const response = await axios.put(`/api/performance-evaluations/${id}`, performanceEvaluation);
  return response.data;
};

export const getPerformanceEvaluationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/performance-evaluations/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deletePerformanceEvaluationById = async (id: string) => {
  const response = await axios.delete(`/api/performance-evaluations/${id}`);
  return response.data;
};
