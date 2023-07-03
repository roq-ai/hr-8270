import { EmployeeInterface } from 'interfaces/employee';
import { GetQueryInterface } from 'interfaces';

export interface EngagementToolInterface {
  id?: string;
  tool_name: string;
  employee_id?: string;
  created_at?: any;
  updated_at?: any;

  employee?: EmployeeInterface;
  _count?: {};
}

export interface EngagementToolGetQueryInterface extends GetQueryInterface {
  id?: string;
  tool_name?: string;
  employee_id?: string;
}
