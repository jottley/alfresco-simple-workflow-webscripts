<?xml version="1.0"?>
<simpleworkflow>
<#if success>
	<success>${success?string}</success>
	<#if move>
	<move/>
	<#else>
	<copy/>
	</#if>
	<step>${step}</step>
	<destination>${destination}</destination>
<#else>
	<success>${success?string}</success>
	<message>${message}</message>
</#if>
</simpleworkflow>