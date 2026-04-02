import { createContext, useContext, useState } from 'react';
import defaultData from './defaultData.json';

export const ModelContext = createContext();

export const ModelProvider = ({ children, projectData: initialProjectData }) => {
  // Use the default data from the json, merging any provided projectData overrides on boot
  const [appState, setAppState] = useState(defaultData);
  const [activeModelKey, setActiveModelKey] = useState(defaultData.activeScenario || 'target');

  const isBaseLocked = appState.enabledScenarios.length > 1;
  const activeData = appState.scenarios[activeModelKey];

  // Helper to deep update the active scenario
  // pathStr can be a dot-notation string like "funding.equityRaised.y1" or "gaExpenseItems[0].y1Units"
  const updateScenarioData = (pathStr, value) => {
    setAppState(prev => {
      const newState = { ...prev };
      newState.scenarios = JSON.parse(JSON.stringify(prev.scenarios));
      
      let current = newState.scenarios[activeModelKey];
      // Parse the path: split on '.' but also handle array notation [n]
      const parts = String(pathStr).replace(/\[(\d+)\]/g, '.$1').split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      
      return newState;
    });
  };

  const addScenario = (key) => {
    if (!appState.scenarios[key]) {
      setAppState(prev => {
        const newState = { ...prev };
        newState.enabledScenarios = [...newState.enabledScenarios, key];
        // Deep copy 'target' as starting point for new scenario
        newState.scenarios = {
          ...newState.scenarios,
          [key]: JSON.parse(JSON.stringify(newState.scenarios.target))
        };
        return newState;
      });
      setActiveModelKey(key);
    }
  };

  const resetAll = () => {
    setAppState(defaultData);
    setActiveModelKey(defaultData.activeScenario || 'target');
  };

  const loadJSON = (jsonData) => {
    if (jsonData.scenarios) {
      setAppState(jsonData);
      setActiveModelKey(jsonData.activeScenario || 'target');
    }
  };

  // Helper to get total arrays for calculations
  const calculateFinancials = (yearKey) => {
      const data = appState.scenarios[activeModelKey];
      
      const getItemsCostOver = (arr, linkedSource, y) => arr.reduce((s, it) => {
          let u = it[`${y}Units`] || 0;
          if (it.linkMode === 'linked') u = (linkedSource[`${y}Units`] || 0);
          return s + (u * (it[`${y}Rate`] || 0));
      }, 0);

      const getMetricsFor = (yk) => {
          const rev1 = (data.unit1Revenue[`${yk}Units`] || 0) * (data.unit1Revenue[`${yk}Rate`] || 0);
          const rev2 = (data.unit2Revenue[`${yk}Units`] || 0) * (data.unit2Revenue[`${yk}Rate`] || 0);
          const rev3 = (data.unit3Revenue[`${yk}Units`] || 0) * (data.unit3Revenue[`${yk}Rate`] || 0);
          const totalRev = rev1 + rev2 + rev3;

          const totalCogs = getItemsCostOver(data.unit1CogsItems, data.unit1Revenue, yk) + getItemsCostOver(data.unit2CogsItems, data.unit2Revenue, yk) + getItemsCostOver(data.unit3CogsItems, data.unit3Revenue, yk);
          const totalCac = getItemsCostOver(data.unit1CacItems, data.unit1Revenue, yk) + getItemsCostOver(data.unit2CacItems, data.unit2Revenue, yk) + getItemsCostOver(data.unit3CacItems, data.unit3Revenue, yk);
          const ga = getItemsCostOver(data.gaExpenseItems || [], {}, yk);
          const ebitda = (totalRev - totalCogs) - ga - totalCac;
          const dep = getItemsCostOver(data.investmentItems || [], {}, yk) * 0.2;
          const interest = (data.funding.debtRaised[yk] || 0) * ((data.funding.interestRate || 0) / 100);
          const pbt = ebitda - dep - interest;
          
          return { rev1, rev2, rev3, totalRev, totalCogs, totalCac, ga, ebitda, dep, interest, pbt };
      };

      // Cumulative tax calculation matching screenshots: taxes on cumulative PBT
      const calculateTaxesFor = (yk) => {
          let cumPbt = 0;
          let cumTaxVal = 0;
          for (const y of ['y1', 'y2', 'y3']) {
              cumPbt += getMetricsFor(y).pbt;
              const taxableAtYear = Math.max(0, cumPbt * 0.25);
              const yearTax = taxableAtYear - cumTaxVal;
              if (y === yk) return yearTax;
              cumTaxVal += Math.max(0, yearTax);
          }
          return 0;
      };

      const m = getMetricsFor(yearKey);
      const taxes = calculateTaxesFor(yearKey);
      const netIncome = m.pbt - taxes;

      return { 
          rev1: m.rev1, rev2: m.rev2, rev3: m.rev3, 
          totalRev: m.totalRev, totalCogs: m.totalCogs, totalCac: m.totalCac, 
          grossMargin: m.totalRev - m.totalCogs, ga: m.ga, ebitda: m.ebitda, 
          depreciation: m.dep, ebit: m.ebitda - m.dep, interest: m.interest, 
          taxes, netIncome 
      };
  };

  return (
    <ModelContext.Provider value={{
      appState,
      models: appState.scenarios, // mapped for legacy dashboard checks
      activeModelKey,
      setActiveModelKey,
      activeData,
      isBaseLocked,
      updateScenarioData,
      addScenario,
      resetAll,
      loadJSON,
      calculateFinancials
    }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
