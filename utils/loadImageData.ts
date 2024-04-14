import { Section, DataItem, Chap, JsonData } from "./types";

  
  // Function to extract all items from the "data" field while maintaining order
  const extractDataItemsFromSection = (section: Section): DataItem[] => {
    const dataItems: DataItem[] = [];
    if (section.data && section.data.length > 0) {
      section.data.forEach((item, index) => {
        item['session_id'] = section.id;
        dataItems.push(item);
      });
    }
    return dataItems;
  };
  
  // Function to extract all items from the "data" field within "chap" field while maintaining order
  const extractDataItemsFromChap = (chap: Chap, sessionId: number): DataItem[] => {
    const dataItems: DataItem[] = [];
    if (chap.data && chap.data.length > 0) {
      chap.data.forEach((item , index) => {
        item['session_id'] = sessionId;
        item['chap_id'] = chap.id;
        dataItems.push(item);
      });
    }
    return dataItems;
  };
  
  // Function to extract all items from both "data" fields in a section
  const extractAllDataItems = (section: Section): DataItem[] => {
    let allDataItems: DataItem[] = [];
    // Extract from the main section
    allDataItems = allDataItems.concat(extractDataItemsFromSection(section));
    // Extract from each chap within the section
    if (section.chap && section.chap.length > 0) {
      section.chap.forEach(chap => {
        allDataItems = allDataItems.concat(extractDataItemsFromChap(chap, section.id));
      });
    }
    return allDataItems;
  };
  
  // Function to extract all data items from all sections
  const extractAllDataItemsFromAllSections = (jsonData: JsonData): DataItem[] => {
    let allDataItems: DataItem[] = [];
    jsonData.section.forEach(section => {
      allDataItems = allDataItems.concat(extractAllDataItems(section));
    });
    return allDataItems.map((item, index) => {
      item['id'] = index;
      return item;
    });
  };
   // Function to extract all data items from all sections
   const extractAllDataItemsBySectionId = (jsonData: JsonData): DataItem[] => {
    let allDataItems: DataItem[] = [];
    jsonData.section.forEach(section => {
      allDataItems = allDataItems.concat(extractAllDataItems(section));
    });
    return allDataItems;
  };
  export default extractAllDataItemsFromAllSections;
