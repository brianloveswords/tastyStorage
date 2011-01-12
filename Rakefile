namespace :build do
  def minified
    require 'net/http'
    require 'uri'
    
    api = URI.parse('http://closure-compiler.appspot.com/')
    api.path = '/compile'
    params = {
      :compilation_level => "SIMPLE_OPTIMIZATIONS",
      :output_format => "text",
      :output_info => "compiled_code",
      :js_code => File.read('./src/tastystorage.js'),
    }
    minified = Net::HTTP.post_form(api, params).body
  end

  desc "Print output of minifaction"
  task :minify do
    puts minified
  end
  
  desc "Build Crockford's json2.js included."
  task :with_json do
    json2 = File.read('./src/json2.min.js')
    File.open('./build/tastystorage.min.js', 'w') do |f|
      f.puts json2
      f.puts minified
    end
  end

  desc "Build without json2.js included. Be sure to provide a JSON object that includes stringify() and parse() methods."
  task :without_json do
    File.open('./build/tastystorage.min.js', 'w') do |f|
      f.puts minified
    end
  end
end

task :default => "build:with_json"
