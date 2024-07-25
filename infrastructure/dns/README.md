# DNS

You can use a local DNS server to test out host based routing temporarily.

On my machine I have to disable `resolved` daemon with:
```
systemctl stop systemd-resolved
```

This will free port 53 on my machine (used for DNS).

Then I have to edit `/etc/resolv.conf`:
```
nameserver 127.0.0.1
```
That's it.

You have to check how to configure your own system DNS configuration.

Then start pi-hole as a DNS server:
```
docker compose up
```

Visit <http://pi.hole> (or <http://localhost>) and configure "Local DNS":

```
| Domain                 | IP             |
| ----------------------------------------|
| auth.dreammall.earth   | <IPv4_ADDRESS> |
| auth.dreammall.earth   | <IPv6_ADDRESS> |
| admin.dreammall.earth  | <IPv4_ADDRESS> |
| admin.dreammall.earth  | <IPv6_ADDRESS> |
| app.dreammall.earth    | <IPv4_ADDRESS> |
| app.dreammall.earth    | <IPv6_ADDRESS> |
| dreammall.earth        | <IPv4_ADDRESS> |
| dreammall.earth        | <IPv6_ADDRESS> |
```

Where `IPv4_ADDRESS` and `IPv6_ADDRESS` are the ip adrresses of your load balancer.

You can now browse the domains listed above and access your clusters domain names.

Once I turn off pi-hole, I can re-enable my previous DNS configuration on my machine with:
```
systemctl restart systemd-resolved
```
The file `/etc/resolv.conf` will be automatically overwritten.

