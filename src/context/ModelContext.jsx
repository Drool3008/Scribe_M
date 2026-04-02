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
  const updateScenarioData = (pathArray, value) => {
    if (activeModelKey === 'target' && isBaseLocked) return; // Prevent edits if locked
    
    setAppState(prev => {
      const newState = { ...prev };
      // Deep clone the scenarios to avoid mutation issues
      newState.scenarios = JSON.parse(JSON.stringify(prev.scenarios));
      
      let current = newState.scenarios[activeModelKey];
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      
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
      // E.g. yearKey = 'y1', 'y2', 'y3'
      const data = appState.scenarios[activeModelKey];
      
      const getRevenue = (unitRev) => {
         return (unitRev[`${yearKey}Units`] || 0) * (unitRev[`${yearKey}Rate`] || 0) * (unitRev.purchasesPerYear || 1);
      };

      const getItemsCost = (itemsArr, linkedUnitsSource) => {
         return itemsArr.reduce((sum, item) => {
             // if linked, use the revenue units. Otherwise use item's own units
             let units = item[`${yearKey}Units`] || 0;
             if (item.linkMode === 'linked') {
                 units = linkedUnitsSource[`${yearKey}Units`] || 0;
             }
             return sum + (units * (item[`${yearKey}Rate`] || 0));
         }, 0);
      };

      const rev1 = getRevenue(data.unit1Revenue);
      const rev2 = getRevenue(data.unit2Revenue);
      const rev3 = getRevenue(data.unit3Revenue);
      const totalRev = rev1 + rev2 + rev3;

      const cogs1 = getItemsCost(data.unit1CogsItems, data.unit1Revenue);
      const cogs2 = getItemsCost(data.unit2CogsItems, data.unit2Revenue);
      const cogs3 = getItemsCost(data.unit3CogsItems, data.unit3Revenue);
      const totalCogs = cogs1 + cogs2 + cogs3;

      const cac1 = getItemsCost(data.unit1CacItems, data.unit1Revenue);
      const cac2 = getItemsCost(data.unit2CacItems, data.unit2Revenue);
      const cac3 = getItemsCost(data.unit3CacItems, data.unit3Revenue);
      const totalCac = cac1 + cac2 + cac3;

      const grossMargin = totalRev - totalCogs;

      // GA Expenses
      const ga = getItemsCost(data.gaExpenseItems || [], {});

      const ebitda = grossMargin - ga - totalCac; // Assumption: CAC is expensed above EBITDA
      
      // Depreciation from investment items
      const depreciation = getItemsCost(data.investmentItems || [], {}) * 0.2;
      const ebit = ebitda - depreciation;
      
      const interest = (data.funding.debtRaised[yearKey] || 0) * (data.funding.interestRate / 100);
      const pbt = ebit - interest;
      const taxes = pbt > 0 ? pbt * 0.25 : 0;
      const netIncome = pbt - taxes;

      return { rev1, rev2, rev3, totalRev, totalCogs, totalCac, grossMargin, ga, ebitda, depreciation, ebit, interest, taxes, netIncome };
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
