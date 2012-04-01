{<#if success>"success": ${success?string}, 
 "action": <#if move>"move"<#else>"copy"</#if>,
 "step": "${step}",
 "destination": "${destination}"
<#else>
 "success": ${success?string},
 "message": "${message}"</#if>}
