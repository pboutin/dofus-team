dim WshShell
set WshShell=Wscript.Createobject("Wscript.shell")
WshShell.AppActivate Wscript.Arguments.Item(0)