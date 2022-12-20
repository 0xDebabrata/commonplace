import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"

import styles from '../../styles/shortcuts.module.css'

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = array[0].join(",") + '\r\n';

  for (var i = 1; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

      let cell = array[i][index]
      line += `\"${cell?.toString().replace(/\n/g, "\\n")}\"`;
    }

    str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, items, filename) {
  items.unshift(headers);
  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = filename + ".csv"

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

const Export = () => {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const exportData = async () => {
    const { data } = await supabaseClient
      .from("cards")
      .select(`id, excerpt, note, created_at, tags, collections (
        collection
      ) `)

    const items = data.map(card => {
      const { id, excerpt, note, created_at, tags, collections } = card
      return {
        id, excerpt, note, created_at,
        tags: tags.join(","),
        collection: JSON.stringify(collections?.collection)
      }
    })
    const headers = ["id, excerpt, note, created_at, tags, collection"]
    exportCSVFile(headers, items, "commonplace-cards-export")

    const { data: tags } = await supabaseClient
      .from("tags")
      .select(`id, name, colour`)

    const tagHeaders = ["id, name, colour"]
    exportCSVFile(tagHeaders, tags, "commonplace-tags-export")
  }

  if (user) {
    return (
      <>
        <p
          className={styles.footerText}
          onClick={exportData}
        >
          Export
        </p>
      </>
    )
  } else {
    return null;
  }
}

export default Export
