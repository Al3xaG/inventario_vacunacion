export function filterIsVaccinated(opt:string, vaccinate: string, listEmployees: any[]){
    const list = listEmployees;
    if(opt && vaccinate){
      if(opt === 'true' && vaccinate !== 'noFilter'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === true && emp.vaccine.vaccineType === vaccinate)).map(u => Object.assign({},u));
          return _list;
        }
      }
      if(opt === 'false' && vaccinate !== 'noFilter'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === false && emp.vaccine.vaccineType === vaccinate)).map(u => Object.assign({},u));
          return  _list;
        }
      }
      if(opt === 'true' && vaccinate === 'noFilter'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === true )).map(u => Object.assign({},u));
          return _list;
        }
      }
      if(opt === 'false' && vaccinate === 'noFilter'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === false)).map(u => Object.assign({},u));
          return _list;
        }
      }
      if(opt === 'noFilter' && vaccinate !== 'noFilter'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.vaccine.vaccineType === vaccinate)).map(u => Object.assign({},u));
          return _list;
        }
      }
      if(opt === 'noFilter' && vaccinate === 'noFilter'){
        return listEmployees;
      }
    } 

    if(opt && !vaccinate){
      if(opt === 'true'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === true)).map(u => Object.assign({},u));
          return _list;
        }
      }
      if(opt === 'false'){
        if(list.length > 0){
          const _list = list.filter(emp => (emp.isVaccinated === false)).map(u => Object.assign({},u));
          return _list;
        }
      }
    }

    if(!opt && vaccinate){
      if(vaccinate !== 'noFilter'){
      if(list.length > 0){
        const _list = list.filter(emp => (emp.isVaccinated === true && emp.vaccine.vaccineType === vaccinate)).map(u => Object.assign({},u));
        return _list;
      }
      }
      
    }
}