// types/apiTypes.ts
interface CompetitorResult {
    mark: string;
    medalType: string;
    position: string;
    irm: string; // Inclua outros campos se necessário
   }
  
  interface Competitor {
    code: string;
    name: string;
    results: CompetitorResult;
    noc: string;  
  }
  
  interface ScheduleItem {
    noc: any;
    eventName: any;
    id: string;
    disciplineName: string;
    eventUnitName: string;
    startDate: string;
    endDate: string;
    locationDescription: string;
    statusDescription: string;
    competitors: Competitor[];
  }
  
  export type { ScheduleItem };
  