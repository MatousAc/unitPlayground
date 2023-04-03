/// permanent storage ///
import { supabase } from '$/lib/js/hooks.client'

let data = ''

async function load() {
  let resp = await supabase.from('countries').select()
  data = resp.data
  console.log(data)
  return {
    countries: data ?? []
  }
}
